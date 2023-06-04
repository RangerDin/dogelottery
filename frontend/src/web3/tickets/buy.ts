import type { Web3Provider } from "@ethersproject/providers";
import {
  LotteryTicket,
  LotteryTicketStatus
} from "~/lottery/declarations/ticket";
import { LotteryContract } from "~/web3/tickets/contract";
import { switchEthereumChain } from "../utils/switchEthereumChain";

export const buyLotteryTicket = async (
  provider: Web3Provider
): Promise<LotteryTicket> => {
  const signer = provider.getSigner();

  const contract = LotteryContract.connect(signer);

  await switchEthereumChain(provider);

  const ticketPrice = await contract.getNewTicketPrice();

  const buyTransaction = await contract.buyTicket({
    value: ticketPrice
  });

  const response = await buyTransaction.wait();

  const ticketId = String(parseInt(response.events[0].args[2]));

  return {
    id: ticketId,
    status: LotteryTicketStatus.NEW
  };
};
