import {
  LotteryTicket,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";

const TIMEOUT_TO_GENERATE_TICKETS = 300;

export const generateLotteryTickets = async (
  count: number
): Promise<LotteryTicket[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      const tickets: LotteryTicket[] = new Array(count)
        .fill(0)
        .map((_, index) => ({
          id: String(index),
          status: LotteryTicketStatus.NEW
        }));

      resolve(tickets);
    }, TIMEOUT_TO_GENERATE_TICKETS);
  });
