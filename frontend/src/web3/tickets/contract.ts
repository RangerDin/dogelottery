import { Contract } from "@ethersproject/contracts";
import { LOTTERY_CONTRACT_ABI } from "~/web3/tickets/abi";

const LOTTERY_CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

export const LotteryContract = new Contract(
  LOTTERY_CONTRACT_ADDRESS,
  LOTTERY_CONTRACT_ABI
);