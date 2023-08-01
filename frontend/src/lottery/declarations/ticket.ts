export type LotteryTicketId = string;

export enum LotteryTicketStatus {
  NEW = "NEW",
  OPENING = "OPENING",
  OPENED = "OPENED",
  SENDING = "SENDING"
}

export type LotteryTicket = {
  id: LotteryTicketId;
} & (
  | {
      status: LotteryTicketStatus.NEW | LotteryTicketStatus.SENDING;
    }
  | {
      status: LotteryTicketStatus.OPENING;
      openedSlot: LotteryTicketSlot;
    }
  | {
      status: LotteryTicketStatus.OPENED | LotteryTicketStatus.SENDING;
      openedSlot: LotteryTicketSlot;
      winningSlot: LotteryTicketSlot;
      ticketHue: number;
    }
);

export type LotteryTicketSlot = number;
export type LotteryTicketHue = number;
