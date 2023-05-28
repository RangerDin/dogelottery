import {
  LotteryTicket,
  LotteryTicketColor,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import { Web3Provider } from "~/web3/declarations";

export const generateLotteryTickets = async (
  provider: Web3Provider,
  count: number
): Promise<LotteryTicket[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      const tickets: LotteryTicket[] = new Array(count)
        .fill(0)
        .map((_, index) => ({
          id: String(index),
          color: LotteryTicketColor.GREEN,
          status: LotteryTicketStatus.NEW
        }));

      resolve(tickets);
    }, 300);
  });
