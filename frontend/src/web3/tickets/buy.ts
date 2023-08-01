import type { Web3Provider } from "@ethersproject/providers";
import {
  LotteryTicket,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import { LotteryContract } from "~/web3/tickets/contract";
import { switchEthereumChain } from "../utils/switchEthereumChain";
import { DogeTokenContract } from "~/web3/dogeToken/contract";

export const buyLotteryTicket = async (
  provider: Web3Provider
): Promise<LotteryTicket> => {
  const signer = provider.getSigner();

  const lotteryContract = LotteryContract.connect(signer);

  await switchEthereumChain(provider);

  const docketTokenContract = DogeTokenContract.connect(signer);

  const ticketPrice = await lotteryContract.getNewTicketPrice();

  const tx = await docketTokenContract.approve(
    lotteryContract.address,
    ticketPrice
  );

  await tx.wait(1);

  const buyTransaction = await lotteryContract.buyTicket();

  const response = await buyTransaction.wait();

  const ticketId = String(parseInt(response.events[2].args[2]));

  return {
    id: ticketId,
    status: LotteryTicketStatus.NEW
  };
};
