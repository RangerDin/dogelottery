import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import {
  LotteryTicketId,
  LotteryTicketSlot
} from "~/lottery/declarations/ticket";
import { LotteryContract } from "~/web3/tickets/contract";
import { switchEthereumChain } from "~/web3/utils/switchEthereumChain";

export const openLotteryTicket = async (
  provider: Web3Provider,
  activeTicketId: LotteryTicketId,
  openSlot: LotteryTicketSlot
): Promise<LotteryTicketSlot> => {
  const contract = LotteryContract.connect(provider.getSigner());

  await switchEthereumChain(provider);

  const transaction = await contract.openTicket(activeTicketId, openSlot);

  await transaction.wait();

  const winningChoice = await waitAndGetWinningChoice(activeTicketId, contract);

  return winningChoice;
};

const TIMEOUT_BETWEEN_CHECKS = 1000;

const waitAndGetWinningChoice = (
  ticketId: LotteryTicketId,
  contract: Contract
): Promise<LotteryTicketSlot> => {
  const getWinningChoice = async () => {
    const response = await contract.getWinChoice(ticketId);

    return response;
  };

  return new Promise(async resolve => {
    const helper = async () => {
      const choice = await getWinningChoice();

      if (choice > 0) {
        resolve(choice);
      } else {
        setTimeout(() => {
          helper();
        }, TIMEOUT_BETWEEN_CHECKS);
      }
    };

    helper();
  });
};
