import { Web3Provider } from "@ethersproject/providers";
import { LotteryTicketId } from "~/lottery/declarations/ticket";
import { LotteryContract } from "~/web3/tickets/contract";
import { switchEthereumChain } from "~/web3/utils/switchEthereumChain";

type SendLotteryTicketOptions = {
  provider: Web3Provider;
  ticketId: LotteryTicketId;
  currentOwnerAddress: string;
  newOwnerAddress: string;
};

export const sendLotteryTicket = async ({
  ticketId,
  currentOwnerAddress,
  newOwnerAddress,
  provider
}: SendLotteryTicketOptions): Promise<void> => {
  const contract = LotteryContract.connect(provider.getSigner());

  await switchEthereumChain(provider);

  const accounts = await provider.listAccounts();

  if (accounts.length === 0) {
    throw new Error("There is no accounts");
  }

  const transaction = await contract.transferFrom(
    currentOwnerAddress,
    newOwnerAddress,
    ticketId
  );

  await transaction.wait();
};
