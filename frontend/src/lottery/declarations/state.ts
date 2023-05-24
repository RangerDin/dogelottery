import {
  LotteryTicket,
  LotteryTicketId,
  LotteryTicketSlot
} from "~/lottery/declarations/ticket";

export enum CONNECTED_LOTTERY_PAGE_STATUS {
  OFFERING_TO_BUY_TICKET = "OFFERING_TO_BUY_TICKET",
  PREPARING_TICKETS = "PREPARING_TICKETS",
  SELECTING_TICKET = "SELECTING_TICKET",
  SHOWING_TICKET = "SHOWING_TICKET",
  OFFERING_TO_SEND_TICKET = "OFFERING_TO_SEND_TICKET",
  SENDING_TICKET = "SENDING_TICKET",
  OPENING_TICKET = "OPENING_TICKET",
  BUYING_TICKET = "BUYING_TICKET"
}

export type LotteryPageState =
  | LotteryPageDisconnectedState
  | LotteryPageConnectedState;

type LotteryPageDisconnectedState = {
  connected: false;
};

type LotteryPageConnectedState = LotteryPageConnectedCommonState &
  (
    | LotteryPageOfferingToBuyTicketState
    | LotteryPagePreparingTicketsState
    | LotteryPageSelectingTicketState
    | LotteryPageBuyingTicketState
    | LotteryPageShowingTicketState
    | LotteryPageOfferingToSendTicketState
    | LotteryPageSendingTicketState
    | LotteryPageOpeningTicketState
  );

type LotteryPageConnectedCommonState = {
  connected: true;
  address: string;
};

type LotteryPageOfferingToBuyTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET;
};

type LotteryPagePreparingTicketsState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS;
};

type LotteryPageSelectingTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET;
  tickets: LotteryTicket;
};

type LotteryPageBuyingTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.BUYING_TICKET;
  tickets: LotteryTicket;
  activeTicket: LotteryTicketId;
};

type LotteryPageShowingTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET;
  tickets: LotteryTicket;
  activeTicket: LotteryTicketId;
};

type LotteryPageOfferingToSendTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET;
  tickets: LotteryTicket;
  activeTicket: LotteryTicketId;
};

type LotteryPageSendingTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET;
  tickets: LotteryTicket;
  activeTicket: LotteryTicketId;
};

type LotteryPageOpeningTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.OPENING_TICKET;
  tickets: LotteryTicket;
  activeTicket: LotteryTicketId;
  slotToOpen: LotteryTicketSlot;
};
