import type * as ethers from "ethers";
import { DogeLottery, TestDogeToken } from "../../typechain-types";

export const buyTicket = async (lottery: DogeLottery, token: TestDogeToken, buyer: ethers.Signer): Promise<number> => {
  const newTicketPrice = await lottery.getNewTicketPrice();

  await token.transfer(buyer.getAddress(), newTicketPrice);
  const buyerToken = token.connect(buyer);
  await buyerToken.approve(lottery.address, newTicketPrice);

  const tx = await lottery.buyTicket();
  const txReceipt = await tx.wait(1);

  const ticketId = txReceipt.events![2].args!.tokenId.toNumber();

  return ticketId;
};
