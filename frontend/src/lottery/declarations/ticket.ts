/* TODO: check this color set */
enum LotteryTicketColor {
  RED = "RED",
  GREEN = "GREEN",
  BLUE = "BLUE",
  YELLOW = "YELLOW",
  ORANGE = "ORANGE"
}

export type LotteryTicketId = string;

enum LotteryTicketStatus {
  NEW = "NEW",
  OPENED = "OPENED"
}

export type LotteryTicket = {
  id: LotteryTicketId;
  color: LotteryTicketColor;
} & (
  | {
      status: LotteryTicketStatus.NEW;
    }
  | {
      status: LotteryTicketStatus.OPENED;
      openedSlot: LotteryTicketSlot;
    }
);

export type LotteryTicketSlot = number;
