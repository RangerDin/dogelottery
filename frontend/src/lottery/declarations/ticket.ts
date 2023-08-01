export type LotteryTicketId = string;

export enum LotteryTicketStatus {
  NEW = "NEW",
  OPENING = "OPENING",
  OPENED = "OPENED"
}

export type LotteryTicket = {
  id: LotteryTicketId;
} & (
  | {
      status: LotteryTicketStatus.NEW;
    }
  | {
      status: LotteryTicketStatus.OPENING;
      openedSlot: LotteryTicketSlot;
    }
  | {
      status: LotteryTicketStatus.OPENED;
      openedSlot: LotteryTicketSlot;
      winningSlot: LotteryTicketSlot;
      ticketHue: number;
    }
);

export type LotteryTicketSlot = number;
export type LotteryTicketHue = number;
