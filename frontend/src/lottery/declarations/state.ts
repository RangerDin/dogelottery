import { LotteryTicket } from "~/lottery/declarations/ticket";

export enum CONNECTED_LOTTERY_PAGE_STATUS {
  OFFERING_TO_BUY_TICKET = "OFFERING_TO_BUY_TICKET",
  PREPARING_TICKETS = "PREPARING_TICKETS",
  OFFERING_TO_SEND_TICKET = "OFFERING_TO_SEND_TICKET",
  SENDING_TICKET = "SENDING_TICKET",
  OFFERING_TO_OPEN_TICKET = "OFFERING_TO_OPEN_TICKET",
  OPENING_TICKET = "OPENING_TICKET",
  BUYING_TICKET = "BUYING_TICKET"
}

export type MutableLotteryPageState = {
  address?: string;
  connection: MutableLotteryPageTransitionState;
  ticketPreparing: MutableLotteryPageProgressState;
  ticketPurchase: MutableLotteryPageTicketPurchaseState;
  tickets: LotteryTicket[];
};

export type MutableLotteryPageProgressState = {
  inProgress: boolean;
};

export type MutableLotteryPageTransitionState =
  MutableLotteryPageProgressState & {
    in: boolean;
  };

export type MutableLotteryPageTicketPurchaseState =
  | {
      inProgress: true;
      status: MutableLotteryPageTicketPurchaseStatus;
    }
  | {
      inProgress: false;
    };

export enum MutableLotteryPageTicketPurchaseStatus {
  setAllowance = "setAllowance",
  ticketPurchasing = "ticketPurchasing"
}
