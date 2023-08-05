import { useEffect, useMemo, useState } from "react";
import {
  LotteryTicketId,
  LotteryTicketSlot
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
import useWeb3ErrorsHandler from "~/web3/errors/useWeb3ErrorsHandler";
import wrapWeb3Errors from "~/web3/errors/wrapWeb3Errors";
import useLotteryPageReducer from "~/lottery/useLotteryPageReducer";
import { LOTTERY_PAGE_ACTION_TYPE } from "~/lottery/useLotteryPageReducer/declarations";

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

const useLotteryPageState = (): UseLotteryPageStateResult => {
  const [checkingConnection, setCheckingConnection] = useState(true);
  const { dispatch, state: mutableState } = useLotteryPageReducer();

  const ticketSelectionDialog = useDialog<SpecificTicketSelectorDialogProps>();
  const ticketDialog = useDialog<SpecificTicketDialogProps>();
  const isActive = useIsActive();
  const isActivating = useIsActivating();
  const address = useAccount();
  const provider = useProvider();
  const handleWeb3Error = useWeb3ErrorsHandler();

  if (address && mutableState.address !== address) {
    dispatch({
      type: LOTTERY_PAGE_ACTION_TYPE.SET_ADDRESS,
      payload: {
        address
      }
    });
  }

  useEffect(() => {
    setCheckingConnection(true);

    metamask
      .connectEagerly()
      .then(() => {
        dispatch({
          type: LOTTERY_PAGE_ACTION_TYPE.SET_CONNECTED
        });
      })
      .catch(() => {
        dispatch({
          type: LOTTERY_PAGE_ACTION_TYPE.SET_DISCONNECTED
        });
        console.debug("Failed to connect eagerly to metamask");
      })
      .finally(() => {
        setCheckingConnection(false);
      });
  }, [dispatch]);

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
    dispatch({
      type: LOTTERY_PAGE_ACTION_TYPE.START_TICKET_PREPARING
    });

    const ticketsToChoose = await generateLotteryTickets(
      LOTTERY_TICKETS_TO_GENERATE
    );

    ticketSelectionDialog.openDialog({
      ticketsToChoose
    });
    dispatch({
      type: LOTTERY_PAGE_ACTION_TYPE.STOP_TICKET_PREPARING
    });
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

      dispatch({
        type: LOTTERY_PAGE_ACTION_TYPE.START_SETTING_ALLOWANCE
      });

      try {
        const activeTicket = await wrapWeb3Errors(() =>
          buyLotteryTicket(provider, () => {
            dispatch({
              type: LOTTERY_PAGE_ACTION_TYPE.START_TICKET_PURCHASING
            });
          })
        );

        dispatch({
          type: LOTTERY_PAGE_ACTION_TYPE.COMPLETE_TICKET_PURCHASING,
          payload: {
            ticket: activeTicket
          }
        });

        setTimeout(() => {
          ticketSelectionDialog.dialogProps.onClose();
        }, HIDE_DIALOG_DELAY);
        ticketDialog.openDialog({
          ticketId: activeTicket.id
        });
      } catch (error) {
        dispatch({
          type: LOTTERY_PAGE_ACTION_TYPE.CANCEL_TICKET_PURCHASING
        });
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

      dispatch({
        type: LOTTERY_PAGE_ACTION_TYPE.START_SENDING_TICKET,
        payload: {
          ticketId: activeTicketId
        }
      });

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

        dispatch({
          type: LOTTERY_PAGE_ACTION_TYPE.COMPLETE_SENDING_TICKET,
          payload: {
            ticketId: activeTicketId
          }
        });
      } catch (error) {
        dispatch({
          type: LOTTERY_PAGE_ACTION_TYPE.CANCEL_SENDING_TICKET,
          payload: {
            ticketId: activeTicketId
          }
        });

        throw error;
      }
    });

  const openTicket = async (
    activeTicketId: LotteryTicketId,
    openedSlot: LotteryTicketSlot
  ) =>
    handleWeb3Error(async () => {
      if (!provider) {
        throw new Error("There is no provider");
      }

      dispatch({
        type: LOTTERY_PAGE_ACTION_TYPE.START_OPENING_TICKET,
        payload: {
          ticketId: activeTicketId,
          openedSlot
        }
      });

      let winningSlot: LotteryTicketSlot;

      try {
        winningSlot = await wrapWeb3Errors(() =>
          openLotteryTicket(provider, activeTicketId, openedSlot)
        );
      } catch (error) {
        dispatch({
          type: LOTTERY_PAGE_ACTION_TYPE.CANCEL_OPENING_TICKET,
          payload: {
            ticketId: activeTicketId
          }
        });

        throw error;
      }

      const ticketHue = await wrapWeb3Errors(() =>
        getHue(provider, activeTicketId)
      );
      dispatch({
        type: LOTTERY_PAGE_ACTION_TYPE.COMPLETE_OPENING_TICKET,
        payload: {
          ticketId: activeTicketId,
          ticketHue,
          winningSlot,
          openedSlot
        }
      });
    });

  const connect = async () =>
    handleWeb3Error(async () => {
      await wrapWeb3Errors(() => metamask.activate());

      dispatch({
        type: LOTTERY_PAGE_ACTION_TYPE.START_CONNECTION
      });
    });

  const onConnected = () => {
    dispatch({
      type: LOTTERY_PAGE_ACTION_TYPE.SET_CONNECTED
    });
  };

  const disconnect = async () =>
    handleWeb3Error(async () => {
      dispatch({
        type: LOTTERY_PAGE_ACTION_TYPE.START_DISCONNECTION
      });

      await wrapWeb3Errors(() => metamask.resetState());
    });

  const onDisconnected = async () => {
    dispatch({
      type: LOTTERY_PAGE_ACTION_TYPE.SET_DISCONNECTED
    });
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
