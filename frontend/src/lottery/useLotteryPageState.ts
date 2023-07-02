import { useEffect, useMemo, useState } from "react";
import {
  CONNECTED_LOTTERY_PAGE_STATUS,
  MutableLotteryPageState
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

const { useIsActive, useIsActivating, useAccount, useProvider } = hooks;

export type LotteryPageHandlers = {
  closeTicket: () => void;
  cancelSendingTicket: () => void;
  cancelOpeningTicket: () => void;
  cancelTicketsSelection: () => void;
  prepareNewTickets: () => void;
  selectTicket: (ticketId: LotteryTicketId) => void;
  buyAndSelectNewTicket: (ticketId: LotteryTicketId) => void;
  offerToOpenTicket: (ticketId: LotteryTicketId) => void;
  offerToSendTicket: (ticketId: LotteryTicketId) => void;
  sendTicket: (ticketId: LotteryTicketId, newOwnerAddress: string) => void;
  openTicket: (
    activeTicketId: LotteryTicketId,
    openSlot: LotteryTicketSlot
  ) => void;
  connect: () => void;
  onConnected: () => void;
  disconnect: () => void;
  onDisconnected: () => void;
};

type UseLotteryPageStateResult = {
  state: LotteryPageState;
  handlers: LotteryPageHandlers;
};

const INITIAL_STATE: MutableLotteryPageState = {
  status: null,
  transition: {
    inProgress: false,
    shown: false
  }
};

const useLotteryPageState = (): UseLotteryPageStateResult => {
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [mutableState, setMutableState] =
    useState<MutableLotteryPageState>(INITIAL_STATE);
  const ticketSelectionDialog = useDialog<SpecificTicketSelectorDialogProps>();
  const isActive = useIsActive();
  const isActivating = useIsActivating();
  const address = useAccount();
  const provider = useProvider();

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
      .catch(() => {
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

    if (
      (!isActive && !mutableState.transition.inProgress) ||
      mutableState.status == null
    ) {
      return {
        connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.DISCONNECTED
      };
    }

    if (
      mutableState.status ===
        CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET ||
      mutableState.status === CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS ||
      mutableState.status === CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET
    ) {
      return {
        connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED,
        ticketSelectionDialog,
        ...mutableState
      };
    }

    const activeTicket = mutableState.tickets.find(
      ({ id }) => id === mutableState.activeTicketId
    );

    if (!activeTicket) {
      throw new Error("Invalid active ticket id");
    }

    return {
      connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.CONNECTED,
      ticketSelectionDialog,
      ...mutableState,
      activeTicket
    };
  }, [
    checkingConnection,
    isActivating,
    isActive,
    mutableState,
    ticketSelectionDialog
  ]);

  const closeTicket = () => {
    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET
      };
    });
  };

  const cancelSendingTicket = () => {
    setMutableState(state => {
      if (
        state.status === CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET
      ) {
        return {
          ...state,
          status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET
        };
      }

      return state;
    });
  };

  const cancelOpeningTicket = () => {
    setMutableState(state => {
      if (
        state.status === CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_OPEN_TICKET
      ) {
        return {
          ...state,
          status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET
        };
      }

      return state;
    });
  };

  const cancelTicketsSelection = () => {
    ticketSelectionDialog.dialogProps.onClose();
    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET
      };
    });
  };

  const prepareNewTickets = async () => {
    setMutableState(state => {
      if (
        state.status !== CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET
      ) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS
      };
    });

    const ticketsToChoose = await generateLotteryTickets(
      LOTTERY_TICKETS_TO_GENERATE
    );

    ticketSelectionDialog.openDialog({
      ticketsToChoose
    });

    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET,
        ticketsToChoose
      };
    });
  };

  const selectTicket = (ticketId: LotteryTicketId) => {
    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET) {
        return state;
      }

      const activeTicket = state.tickets.find(({ id }) => id === ticketId);

      if (!activeTicket) {
        return state;
      }

      return {
        ...state,
        tickets: state.tickets,
        status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET,
        activeTicketId: ticketId,
        openSlot:
          activeTicket.status === LotteryTicketStatus.NEW
            ? null
            : activeTicket.openedSlot
      };
    });
  };

  const buyAndSelectNewTicket = async () => {
    if (!provider) {
      throw new Error("There is no provider");
    }

    const activeTicket = await buyLotteryTicket(provider);

    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET,
        tickets: [...state.tickets, activeTicket],
        activeTicketId: activeTicket.id,
        openSlot: null
      };
    });
  };

  const offerToOpenTicket = async (activeTicketId: LotteryTicketId) => {
    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_OPEN_TICKET,
        activeTicketId
      };
    });
  };

  const offerToSendTicket = async (activeTicketId: LotteryTicketId) => {
    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET,
        activeTicketId
      };
    });
  };

  const sendTicket = async (
    activeTicketId: LotteryTicketId,
    newOwnerAddress: string
  ) => {
    if (!provider) {
      throw new Error("There is no provider");
    }

    if (!mutableState.address) {
      throw new Error("There is no address");
    }

    setMutableState(state => {
      if (
        state.status !== CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET
      ) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET,
        activeTicketId
      };
    });

    await sendLotteryTicket({
      ticketId: activeTicketId,
      currentOwnerAddress: mutableState.address,
      newOwnerAddress,
      provider
    });

    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET,
        tickets: state.tickets.filter(({ id }) => id !== activeTicketId),
        uiTransition: null
      };
    });
  };

  const openTicket = async (
    activeTicketId: LotteryTicketId,
    openSlot: LotteryTicketSlot
  ) => {
    if (!provider) {
      throw new Error("There is no provider");
    }

    setMutableState(state => {
      if (
        state.status !== CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_OPEN_TICKET
      ) {
        return state;
      }

      const ticketsWithOpeningTicket = [...state.tickets];
      const activeTicketIndex = ticketsWithOpeningTicket.findIndex(
        ({ id }) => id === activeTicketId
      );

      if (activeTicketIndex === -1) {
        return state;
      }

      const openingTicket: LotteryTicket = {
        ...ticketsWithOpeningTicket[activeTicketIndex],
        status: LotteryTicketStatus.OPENING,
        openedSlot: openSlot
      };
      ticketsWithOpeningTicket[activeTicketIndex] = openingTicket;

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.OPENING_TICKET,
        tickets: ticketsWithOpeningTicket,
        activeTicketId,
        openSlot,
        uiTransition: null
      };
    });

    const winningSlot = await openLotteryTicket(
      provider,
      activeTicketId,
      openSlot
    );

    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.OPENING_TICKET) {
        return state;
      }

      const ticketsWithOpenedTicket = [...state.tickets];
      const activeTicketIndex = ticketsWithOpenedTicket.findIndex(
        ({ id }) => id === activeTicketId
      );

      if (activeTicketIndex === -1) {
        return state;
      }

      const activeTicket = ticketsWithOpenedTicket[activeTicketIndex];

      const openedTicket: LotteryTicket = {
        ...activeTicket,
        status: LotteryTicketStatus.OPENED,
        winningSlot,
        openedSlot: openSlot
      };
      ticketsWithOpenedTicket[activeTicketIndex] = openedTicket;

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET,
        tickets: ticketsWithOpenedTicket,
        activeTicketId,
        openSlot,
        uiTransition: null
      };
    });
  };

  const connect = async () => {
    setMutableState({
      status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET,
      tickets: [],
      transition: {
        inProgress: true,
        shown: true
      }
    });

    await metamask.activate();
  };

  const onConnected = () => {
    setMutableState(state => {
      if (
        state.status !== CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET
      ) {
        return state;
      }

      return {
        ...state,
        status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET,
        transition: {
          inProgress: false,
          shown: true
        }
      };
    });
  };

  const disconnect = async () => {
    setMutableState(state => ({
      ...state,
      transition: {
        inProgress: true,
        shown: false
      }
    }));

    await metamask.resetState();
  };

  const onDisconnected = async () => {
    setMutableState(state => ({
      ...state,
      transition: {
        inProgress: false,
        shown: false
      }
    }));
  };

  return {
    state,
    handlers: {
      closeTicket,
      cancelSendingTicket,
      cancelOpeningTicket,
      prepareNewTickets,
      cancelTicketsSelection,
      selectTicket,
      buyAndSelectNewTicket,
      offerToOpenTicket,
      offerToSendTicket,
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
