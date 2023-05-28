import { useCallback, useMemo, useState } from "react";
import {
  CONNECTED_LOTTERY_PAGE_STATUS,
  LotteryPageState,
  MutableLotteryPageState
} from "~/lottery/declarations/state";
import {
  LotteryTicketId,
  LotteryTicketSlot
} from "~/lottery/declarations/ticket";
import { hooks, metamask } from "~/web3/connectors/metamask";
import { buyLotteryTicket } from "~/web3/tickets/buy";
import { openLotteryTicket } from "~/web3/tickets/open";
import { generateLotteryTickets } from "~/web3/tickets/generate";

const { useIsActive, useAccount } = hooks;

type UseLotteryPageStateResult = {
  state: LotteryPageState;
  prepareNewTickets: () => void;
  buyAndSelectNewTicket: (ticketId: LotteryTicketId) => void;
  offerToSendTicket: (ticketId: LotteryTicketId) => void;
  sendTicket: (ticketId: LotteryTicketId) => void;
  openTicket: (
    activeTicketId: LotteryTicketId,
    openSlot: LotteryTicketSlot
  ) => void;
};

const INITIAL_STATE: MutableLotteryPageState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET
};

const useLotteryPageState = (): UseLotteryPageStateResult => {
  const [mutableState, setMutableState] =
    useState<MutableLotteryPageState>(INITIAL_STATE);
  const isActive = useIsActive();
  const address = useAccount();

  const state: LotteryPageState = useMemo<LotteryPageState>(() => {
    if (!isActive) {
      return {
        connected: false
      };
    }

    return {
      connected: true,
      address,
      ...mutableState
    };
  }, [address, isActive, mutableState]);

  const prepareNewTickets = async () => {
    setMutableState({
      status: CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS
    });

    const tickets = await generateLotteryTickets(metamask, 10);

    setMutableState({
      status: CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET,
      tickets
    });
  };

  const buyAndSelectNewTicket = async () => {
    if (
      mutableState.status !== CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET
    ) {
      return mutableState;
    }

    const activeTicket = await buyLotteryTicket();

    setMutableState(() => ({
      status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET,
      tickets: [...mutableState.tickets, activeTicket],
      activeTicketId: activeTicket.id,
      openSlot: null
    }));
  };

  const offerToSendTicket = async (activeTicketId: LotteryTicketId) => {
    if (mutableState.status !== CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET) {
      return mutableState;
    }

    setMutableState(() => ({
      status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET,
      tickets: mutableState.tickets,
      activeTicketId
    }));
  };

  const sendTicket = async (activeTicketId: LotteryTicketId) => {
    if (
      mutableState.status !==
      CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET
    ) {
      return mutableState;
    }

    setMutableState(() => ({
      status: CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET,
      tickets: mutableState.tickets,
      activeTicketId
    }));
  };

  const openTicket = async (
    activeTicketId: LotteryTicketId,
    openSlot: LotteryTicketSlot
  ) => {
    if (mutableState.status !== CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET) {
      return mutableState;
    }

    setMutableState(() => ({
      status: CONNECTED_LOTTERY_PAGE_STATUS.OPENING_TICKET,
      tickets: mutableState.tickets,
      activeTicketId,
      openSlot
    }));

    await openLotteryTicket(activeTicketId, openSlot);

    setMutableState(() => ({
      status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET,
      tickets: mutableState.tickets,
      activeTicketId,
      openSlot
    }));
  };

  return {
    state,
    prepareNewTickets,
    buyAndSelectNewTicket,
    offerToSendTicket,
    sendTicket,
    openTicket
  };
};

export default useLotteryPageState;
