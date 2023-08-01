import { useEffect, useMemo, useState } from "react";
import {
  CONNECTED_LOTTERY_PAGE_STATUS,
  MutableLotteryPageState,
  MutableLotteryPageTicketPurchaseStatus
} from "~/lottery/declarations/state";
import {
  LotteryTicket,
  LotteryTicketId,
  LotteryTicketSlot,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import { hooks, metamask } from "~/web3/connectors/metamask";
import { buyLotteryTicket } from "~/web3/tickets/buy";
import { openLotteryTicket } from "~/web3/tickets/open";
import { generateLotteryTickets } from "~/web3/tickets/generate";
import { sendLotteryTicket } from "~/web3/tickets/send";
import { LOTTERY_TICKETS_TO_GENERATE } from "~/lottery/constants";
import useDialog from "~/ui/Dialog/useDialog";
import { SpecificTicketSelectorDialogProps } from "~/lottery/components/TicketSelectorDialog/TicketSelectorDialog";
import {
  LOTTERY_PAGE_CONNECTION_STATUS,
  LotteryPageState
} from "~/lottery/declarations/page";
import { getHue } from "~/web3/tickets/getHue";
import { SpecificTicketDialogProps } from "~/lottery/components/TicketDialog/declarations";
import wrapWeb3Errors from "~/web3/utils/wrapWeb3Errors";
import useWeb3ErrorsHandler from "~/web3/errors/useWeb3ErrorsHandler";

const { useIsActive, useIsActivating, useAccount, useProvider } = hooks;

export type LotteryPageHandlers = {
  prepareNewTickets: () => void;
  selectTicket: (ticketId: LotteryTicketId) => void;
  buyAndSelectNewTicket: (ticketId: LotteryTicketId) => void;
  sendTicket: (
    ticketId: LotteryTicketId,
    newOwnerAddress: string
  ) => Promise<void>;
  openTicket: (
    activeTicketId: LotteryTicketId,
    openSlot: LotteryTicketSlot
  ) => Promise<void>;
  connect: () => void;
  onConnected: () => void;
  disconnect: () => void;
  onDisconnected: () => void;
};

type UseLotteryPageStateResult = {
  state: LotteryPageState;
  handlers: LotteryPageHandlers;
};

const HIDE_DIALOG_DELAY = 300;

const INITIAL_STATE: MutableLotteryPageState = {
  tickets: [],
  ticketPreparing: {
    inProgress: false
  },
  connection: {
    inProgress: false,
    in: false
  },
  ticketPurchase: {
    inProgress: false
  }
};

const useLotteryPageState = (): UseLotteryPageStateResult => {
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [mutableState, setMutableState] =
    useState<MutableLotteryPageState>(INITIAL_STATE);
  const ticketSelectionDialog = useDialog<SpecificTicketSelectorDialogProps>();
  const ticketDialog = useDialog<SpecificTicketDialogProps>();
  const isActive = useIsActive();
  const isActivating = useIsActivating();
  const address = useAccount();
  const provider = useProvider();
  const handleWeb3Error = useWeb3ErrorsHandler();

  if (address && mutableState.address !== address) {
    setMutableState(state => ({
      ...state,
      address
    }));
  }

  useEffect(() => {
    setCheckingConnection(true);

    metamask
      .connectEagerly()
      .then(() => {
        setMutableState(state => ({
          ...state,
          connection: {
            in: true,
            inProgress: false
          }
        }));
      })
      .catch(() => {
        setMutableState(state => ({
          ...state,
          connection: {
            in: false,
            inProgress: false
          }
        }));
        console.debug("Failed to connect eagerly to metamask");
      })
      .finally(() => {
        setCheckingConnection(false);
      });
  }, []);

  const state: LotteryPageState = useMemo((): LotteryPageState => {
    if (checkingConnection) {
      return {
        connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.CHECKING_CONNECTION
      };
    }

    if (isActivating) {
      return {
        connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.CONNECTING
      };
    }

    if (!isActive && !mutableState.connection.inProgress) {
      return {
        connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.DISCONNECTED
      };
    }

    const activeTicket =
      mutableState.tickets.find(
        ({ id }) => id === ticketDialog.payload?.ticketId
      ) ?? null;

    return {
      connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED,
      activeTicket,
      ticketSelectionDialog,
      ticketDialog,
      ...mutableState
    };
  }, [
    checkingConnection,
    isActivating,
    isActive,
    mutableState,
    ticketDialog,
    ticketSelectionDialog
  ]);

  const prepareNewTickets = async () => {
    setMutableState(state => ({
      ...state,
      ticketPreparing: {
        inProgress: true
      }
    }));

    const ticketsToChoose = await generateLotteryTickets(
      LOTTERY_TICKETS_TO_GENERATE
    );

    ticketSelectionDialog.openDialog({
      ticketsToChoose
    });
    setMutableState(state => ({
      ...state,
      ticketPreparing: {
        inProgress: false
      }
    }));
  };

  const selectTicket = (ticketId: LotteryTicketId) => {
    ticketDialog.openDialog({
      ticketId
    });
  };

  const buyAndSelectNewTicket = async () =>
    handleWeb3Error(async () => {
      if (!provider) {
        throw new Error("There is no provider");
      }

      setMutableState(state => ({
        ...state,
        ticketPurchase: {
          inProgress: true,
          status: MutableLotteryPageTicketPurchaseStatus.setAllowance
        }
      }));

      try {
        const activeTicket = await wrapWeb3Errors(() =>
          buyLotteryTicket(provider, () => {
            setMutableState(state => ({
              ...state,
              ticketPurchase: {
                inProgress: true,
                status: MutableLotteryPageTicketPurchaseStatus.ticketPurchasing
              }
            }));
          })
        );

        setMutableState(state => {
          return {
            ...state,
            status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET,
            tickets: [...state.tickets, activeTicket],
            ticketPurchase: {
              inProgress: false
            }
          };
        });

        setTimeout(() => {
          ticketSelectionDialog.dialogProps.onClose();
        }, HIDE_DIALOG_DELAY);
        ticketDialog.openDialog({
          ticketId: activeTicket.id
        });
      } catch (error) {
        setMutableState(state => ({
          ...state,
          ticketPurchase: {
            inProgress: false
          }
        }));
        ticketSelectionDialog.dialogProps.onClose();

        throw error;
      }
    });

  const sendTicket = async (
    activeTicketId: LotteryTicketId,
    newOwnerAddress: string
  ) =>
    handleWeb3Error(async () => {
      if (!provider) {
        throw new Error("There is no provider");
      }

      if (!mutableState.address) {
        throw new Error("There is no address");
      }

      setMutableState(state => ({
        ...state,
        tickets: state.tickets.map(ticket => {
          if (ticket.id !== activeTicketId) {
            return ticket;
          }

          if (ticket.status === LotteryTicketStatus.NEW) {
            return {
              ...ticket,
              status: LotteryTicketStatus.SENDING_NEW
            };
          }

          if (ticket.status === LotteryTicketStatus.OPENED) {
            return {
              ...ticket,
              status: LotteryTicketStatus.SENDING_OPENED
            };
          }

          return ticket;
        })
      }));

      const currentOwnerAddress = mutableState.address;

      try {
        await wrapWeb3Errors(() =>
          sendLotteryTicket({
            ticketId: activeTicketId,
            currentOwnerAddress,
            newOwnerAddress,
            provider
          })
        );

        setMutableState(state => ({
          ...state,
          tickets: state.tickets.filter(({ id }) => id !== activeTicketId)
        }));
      } catch (error) {
        setMutableState(state => ({
          ...state,
          tickets: state.tickets.map(ticket => {
            if (ticket.status === LotteryTicketStatus.SENDING_NEW) {
              return {
                ...ticket,
                status: LotteryTicketStatus.NEW
              };
            }

            if (ticket.status === LotteryTicketStatus.SENDING_OPENED) {
              return {
                ...ticket,
                status: LotteryTicketStatus.OPENED
              };
            }

            return ticket;
          })
        }));

        throw error;
      }
    });

  const openTicket = async (
    activeTicketId: LotteryTicketId,
    openSlot: LotteryTicketSlot
  ) =>
    handleWeb3Error(async () => {
      if (!provider) {
        throw new Error("There is no provider");
      }

      setMutableState(state => {
        return {
          ...state,
          tickets: state.tickets.map(ticket => {
            if (ticket.id !== activeTicketId) {
              return ticket;
            }

            const openingTicket: LotteryTicket = {
              ...ticket,
              status: LotteryTicketStatus.OPENING,
              openedSlot: openSlot
            };

            return openingTicket;
          })
        };
      });

      let winningSlot: LotteryTicketSlot;

      try {
        winningSlot = await wrapWeb3Errors(() =>
          openLotteryTicket(provider, activeTicketId, openSlot)
        );
      } catch (error) {
        setMutableState(state => {
          return {
            ...state,
            tickets: state.tickets.map(ticket => {
              if (ticket.id !== activeTicketId) {
                return ticket;
              }

              const openingTicket: LotteryTicket = {
                id: ticket.id,
                status: LotteryTicketStatus.NEW
              };

              return openingTicket;
            })
          };
        });

        throw error;
      }

      const ticketHue = await wrapWeb3Errors(() =>
        getHue(provider, activeTicketId)
      );

      setMutableState(state => {
        return {
          ...state,
          tickets: state.tickets.map(ticket => {
            if (ticket.id !== activeTicketId) {
              return ticket;
            }

            const openedTicket: LotteryTicket = {
              ...ticket,
              status: LotteryTicketStatus.OPENED,
              winningSlot,
              ticketHue,
              openedSlot: openSlot
            };

            return openedTicket;
          })
        };
      });
    });

  const connect = async () =>
    handleWeb3Error(async () => {
      await wrapWeb3Errors(() => metamask.activate());

      setMutableState(state => ({
        ...state,
        connection: {
          inProgress: true,
          in: true
        }
      }));
    });

  const onConnected = () => {
    setMutableState(state => {
      return {
        ...state,
        connection: {
          inProgress: false,
          in: true
        }
      };
    });
  };

  const disconnect = async () =>
    handleWeb3Error(async () => {
      setMutableState(state => ({
        ...state,
        connection: {
          inProgress: true,
          in: false
        }
      }));

      await wrapWeb3Errors(() => metamask.resetState());
    });

  const onDisconnected = async () => {
    setMutableState(state => ({
      ...state,
      tickets: [],
      connection: {
        inProgress: false,
        in: false
      }
    }));
  };

  return {
    state,
    handlers: {
      prepareNewTickets,
      selectTicket,
      buyAndSelectNewTicket,
      sendTicket,
      openTicket,
      connect,
      disconnect,
      onConnected,
      onDisconnected
    }
  };
};

export default useLotteryPageState;
