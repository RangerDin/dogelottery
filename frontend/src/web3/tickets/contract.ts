import { Contract } from "@ethersproject/contracts";
import { LOTTERY_CONTRACT_ABI } from "~/web3/tickets/abi";

const LOTTERY_CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

export const LotteryContract = new Contract(
  LOTTERY_CONTRACT_ADDRESS,
  LOTTERY_CONTRACT_ABI
);
