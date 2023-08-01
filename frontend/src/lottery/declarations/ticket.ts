export type LotteryTicketId = string;

export enum LotteryTicketStatus {
  NEW = "NEW",
  OPENING = "OPENING",
  OPENED = "OPENED",
  SENDING = "SENDING",
  SENDING_NEW = "SENDING_NEW",
  SENDING_OPENED = "SENDING_OPENED"
}

export type LotteryTicket = {
  id: LotteryTicketId;
} & (
  | {
      status: LotteryTicketStatus.NEW | LotteryTicketStatus.SENDING_NEW;
    }
  | {
      status: LotteryTicketStatus.OPENING;
      openedSlot: LotteryTicketSlot;
    }
  | {
      status: LotteryTicketStatus.OPENED | LotteryTicketStatus.SENDING_OPENED;
      openedSlot: LotteryTicketSlot;
      winningSlot: LotteryTicketSlot;
      ticketHue: number;
    }
);

export type LotteryTicketSlot = number;
export type LotteryTicketHue = number;
