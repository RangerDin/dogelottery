import {
  LotteryTicket,
  LotteryTicketColor,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";

let fakeIdCounter = 1;

export const buyLotteryTicket = (): LotteryTicket => ({
  id: `fake ${fakeIdCounter++}`,
  color: LotteryTicketColor.BLUE,
  status: LotteryTicketStatus.NEW
});
