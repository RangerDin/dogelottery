import { DogeLottery } from "../../typechain-types";

export const buyTicket = async (lottery: DogeLottery): Promise<number> => {
  const newTicketPrice = await lottery.getNewTicketPrice();
  const tx = await lottery.buyTicket({
    value: newTicketPrice,
  });
  const txReceipt = await tx.wait(1);

  const ticketId = txReceipt.events![0].args!.tokenId.toNumber();

  return ticketId;
};
