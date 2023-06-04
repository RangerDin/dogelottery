import { useEffect, useMemo, useState } from "react";
import {
  CONNECTED_LOTTERY_PAGE_STATUS,
  LotteryPageState,
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

const { useIsActive, useIsActivating, useAccount, useProvider } = hooks;

export type LotteryPageHandlers = {
  closeTicket: () => void;
  cancelSendingTicket: () => void;
  prepareNewTickets: () => void;
  selectTicket: (ticketId: LotteryTicketId) => void;
  buyAndSelectNewTicket: (ticketId: LotteryTicketId) => void;
  offerToSendTicket: (ticketId: LotteryTicketId) => void;
  sendTicket: (ticketId: LotteryTicketId, newOwnerAddress: string) => void;
  openTicket: (
    activeTicketId: LotteryTicketId,
    openSlot: LotteryTicketSlot
  ) => void;
};

type UseLotteryPageStateResult = {
  state: LotteryPageState;
  handlers: LotteryPageHandlers;
};

const INITIAL_STATE: MutableLotteryPageState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET,
  tickets: []
};

const useLotteryPageState = (): UseLotteryPageStateResult => {
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [mutableState, setMutableState] =
    useState<MutableLotteryPageState>(INITIAL_STATE);
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
        checkingConnection: true
      };
    }

    if (!isActive) {
      return {
        connected: false,
        connecting: isActivating,
        checkingConnection: false
      };
    }

    if (
      mutableState.status ===
        CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET ||
      mutableState.status === CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS ||
      mutableState.status === CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET
    ) {
      return {
        connected: true,
        checkingConnection: false,
        address,
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
      connected: true,
      checkingConnection: false,
      address,
      ...mutableState,
      activeTicket
    };
  }, [address, checkingConnection, isActivating, isActive, mutableState]);

  const closeTicket = () => {
    setMutableState(state => ({
      ...state,
      status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET
    }));
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

  const prepareNewTickets = async () => {
    setMutableState(state => ({
      ...state,
      status: CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS
    }));

    const ticketsToChoose = await generateLotteryTickets(10);

    setMutableState(state => ({
      ...state,
      status: CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET,
      ticketsToChoose
    }));
  };

  const selectTicket = (ticketId: LotteryTicketId) => {
    setMutableState(state => {
      const activeTicket = state.tickets.find(({ id }) => id === ticketId);

      if (!activeTicket) {
        return state;
      }

      return {
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

    if (!address) {
      throw new Error("There is no address");
    }

    const activeTicket = await buyLotteryTicket(provider);

    setMutableState(state => ({
      ...state,
      status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET,
      tickets: [...state.tickets, activeTicket],
      activeTicketId: activeTicket.id,
      openSlot: null
    }));
  };

  const offerToSendTicket = async (activeTicketId: LotteryTicketId) => {
    setMutableState(state => ({
      ...state,
      status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET,
      activeTicketId
    }));
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

    setMutableState(state => ({
      ...state,
      status: CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET,
      activeTicketId
    }));

    await sendLotteryTicket({
      ticketId: activeTicketId,
      currentOwnerAddress: address,
      newOwnerAddress,
      provider
    });

    setMutableState(state => ({
      status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET,
      tickets: state.tickets.filter(({ id }) => id !== activeTicketId)
    }));
  };

  const openTicket = async (
    activeTicketId: LotteryTicketId,
    openSlot: LotteryTicketSlot
  ) => {
    if (!provider) {
      throw new Error("There is no provider");
    }

    setMutableState(state => {
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
        openSlot
      };
    });

    const winningSlot = await openLotteryTicket(
      provider,
      activeTicketId,
      openSlot
    );

    setMutableState(state => {
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
        openSlot
      };
    });
  };

  return {
    state,
    handlers: {
      closeTicket,
      cancelSendingTicket,
      prepareNewTickets,
      selectTicket,
      buyAndSelectNewTicket,
      offerToSendTicket,
      sendTicket,
      openTicket
    }
  };
};

export default useLotteryPageState;
