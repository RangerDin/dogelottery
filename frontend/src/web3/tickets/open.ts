import {
  LotteryTicket,
  LotteryTicketId,
  LotteryTicketSlot
} from "~/lottery/declarations/ticket";

export const openLotteryTicket = (
  activeTicketId: LotteryTicketId,
  openSlot: LotteryTicketSlot
): Promise<void> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
