import { LotteryTicket } from "~/lottery/declarations/ticket";

export enum CONNECTED_LOTTERY_PAGE_STATUS {
  OFFERING_TO_BUY_TICKET = "OFFERING_TO_BUY_TICKET",
  PREPARING_TICKETS = "PREPARING_TICKETS",
  SHOWING_TICKET = "SHOWING_TICKET",
  OFFERING_TO_SEND_TICKET = "OFFERING_TO_SEND_TICKET",
  SENDING_TICKET = "SENDING_TICKET",
  OFFERING_TO_OPEN_TICKET = "OFFERING_TO_OPEN_TICKET",
  OPENING_TICKET = "OPENING_TICKET",
  BUYING_TICKET = "BUYING_TICKET"
}

export type MutableLotteryPageState = {
  address?: string;
  transition: {
    connection: MutableLotteryPageTransitionState;
    ticketPreparing: MutableLotteryPageTransitionState;
  };
  tickets: LotteryTicket[];
};

export type MutableLotteryPageTransitionState = {
  in: boolean;
  inProgress: boolean;
};
