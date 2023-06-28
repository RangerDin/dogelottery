import { useEffect, useMemo, useState } from "react";
import {
  CONNECTED_LOTTERY_PAGE_STATUS,
  LOTTERY_PAGE_UI_TRANSITION,
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
  uiTransition: null,
  status: null
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

    if (
      isActivating ||
      mutableState.uiTransition === LOTTERY_PAGE_UI_TRANSITION.CONNECTING
    ) {
      return {
        connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.CONNECTING
      };
    }

    if (
      mutableState.uiTransition === LOTTERY_PAGE_UI_TRANSITION.DISCONNECTING
    ) {
      return {
        connectionStatus: LOTTERY_PAGE_CONNECTION_STATUS.DISCONNECTING
      };
    }

    if (!isActive || mutableState.status == null) {
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
        address,
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
      address,
      ticketSelectionDialog,
      ...mutableState,
      activeTicket
    };
  }, [
    address,
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
        tickets: state.tickets,
        status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET,
        activeTicketId: ticketId,
        uiTransition: null,
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

    if (!address) {
      throw new Error("There is no address");
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

    if (!address) {
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
      currentOwnerAddress: address,
      newOwnerAddress,
      provider
    });

    setMutableState(state => {
      if (state.status !== CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET) {
        return state;
      }

      return {
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
      uiTransition: LOTTERY_PAGE_UI_TRANSITION.CONNECTING,
      status: null
    });

    metamask.activate();
  };

  const onConnected = () => {
    setMutableState({
      uiTransition: null,
      status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET,
      tickets: []
    });
  };

  const disconnect = async () => {
    setMutableState(state => {
      if (!state.status) {
        return state;
      }

      return {
        ...state,
        uiTransition: LOTTERY_PAGE_UI_TRANSITION.DISCONNECTING
      };
    });

    metamask.resetState();
  };

  const onDisconnected = () => {
    setMutableState({
      uiTransition: null,
      status: null
    });
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
