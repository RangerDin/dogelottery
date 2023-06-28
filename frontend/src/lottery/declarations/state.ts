import { LotteryTicket, LotteryTicketId } from "~/lottery/declarations/ticket";

export enum CONNECTED_LOTTERY_PAGE_STATUS {
  OFFERING_TO_BUY_TICKET = "OFFERING_TO_BUY_TICKET",
  PREPARING_TICKETS = "PREPARING_TICKETS",
  SELECTING_TICKET = "SELECTING_TICKET",
  SHOWING_TICKET = "SHOWING_TICKET",
  OFFERING_TO_SEND_TICKET = "OFFERING_TO_SEND_TICKET",
  SENDING_TICKET = "SENDING_TICKET",
  OFFERING_TO_OPEN_TICKET = "OFFERING_TO_OPEN_TICKET",
  OPENING_TICKET = "OPENING_TICKET",
  BUYING_TICKET = "BUYING_TICKET"
}

export enum LOTTERY_PAGE_UI_TRANSITION {
  CONNECTING = "CONNECTING",
  DISCONNECTING = "DISCONNECTING"
}

export type MutableLotteryPageState =
  | MutableLotteryPageStateDisconnected
  | MutableLotteryPageStateConnecting
  | MutableLotteryPageStateConnected;

export type MutableLotteryPageStateDisconnected = {
  uiTransition: null;
  status: null;
};

export type MutableLotteryPageStateConnecting = {
  uiTransition: LOTTERY_PAGE_UI_TRANSITION.CONNECTING;
  status: null;
};

export type MutableLotteryPageStateConnected = {
  uiTransition: LOTTERY_PAGE_UI_TRANSITION.DISCONNECTING | null;
} & (
  | LotteryPageStateWithoutActiveTicket
  | MutableLotteryPageStateWithActiveTicketId
);

export type MutableLotteryPageStateWithActiveTicketId =
  | LotteryPageBuyingTicketState
  | LotteryPageShowingTicketState
  | LotteryPageOfferingToSendTicketState
  | LotteryPageSendingTicketState
  | LotteryPageOfferingToOpenTicketState
  | LotteryPageOpeningTicketState;

export type LotteryPageStateWithoutActiveTicket =
  | LotteryPageOfferingToBuyTicketState
  | LotteryPagePreparingTicketsState
  | LotteryPageSelectingTicketState;

type LotteryPageOfferingToBuyTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_BUY_TICKET;
  tickets: LotteryTicket[];
};

type LotteryPagePreparingTicketsState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.PREPARING_TICKETS;
  tickets: LotteryTicket[];
};

export type LotteryPageSelectingTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.SELECTING_TICKET;
  tickets: LotteryTicket[];
  ticketsToChoose: LotteryTicket[];
};

type LotteryPageBuyingTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.BUYING_TICKET;
  tickets: LotteryTicket[];
  activeTicketId: LotteryTicketId;
};

type LotteryPageShowingTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.SHOWING_TICKET;
  tickets: LotteryTicket[];
  activeTicketId: LotteryTicketId;
};

type LotteryPageOfferingToSendTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_SEND_TICKET;
  tickets: LotteryTicket[];
  activeTicketId: LotteryTicketId;
};

type LotteryPageSendingTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.SENDING_TICKET;
  tickets: LotteryTicket[];
  activeTicketId: LotteryTicketId;
};

type LotteryPageOfferingToOpenTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.OFFERING_TO_OPEN_TICKET;
  tickets: LotteryTicket[];
  activeTicketId: LotteryTicketId;
};

type LotteryPageOpeningTicketState = {
  status: CONNECTED_LOTTERY_PAGE_STATUS.OPENING_TICKET;
  tickets: LotteryTicket[];
  activeTicketId: LotteryTicketId;
};
