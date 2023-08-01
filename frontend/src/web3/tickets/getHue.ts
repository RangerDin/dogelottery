import { Web3Provider } from "@ethersproject/providers";
import {
  LotteryTicketId,
  LotteryTicketHue
} from "~/lottery/declarations/ticket";
import { LotteryContract } from "~/web3/tickets/contract";
import { switchEthereumChain } from "~/web3/utils/switchEthereumChain";

export const getHue = async (
  provider: Web3Provider,
  ticketId: LotteryTicketId
): Promise<LotteryTicketHue> => {
  const contract = LotteryContract.connect(provider.getSigner());

  await switchEthereumChain(provider);

  const hueAsBigInt = await contract.getTicketBackgroundStartColorHue(ticketId);
  const hue = hueAsBigInt.toNumber();

  return hue;
};
