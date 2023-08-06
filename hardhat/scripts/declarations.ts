import { BigNumberish, BytesLike } from "ethers";

export type DogeLotteryOptions = {
  subscriptionId: BigNumberish;
  vrfCoordinatorAddress: string;
  vrfGasLaneHash: BytesLike;
  newTicketPrice: BigNumberish;
  baseURL: string;
  dogeTokenAddress: string;
  dogeTokenRequestAmount: BigNumberish;
};
