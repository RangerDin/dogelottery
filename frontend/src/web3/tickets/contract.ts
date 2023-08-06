import { Contract } from "@ethersproject/contracts";
import { getEnvOrThrowError } from "~/utils/envs";
import { LOTTERY_CONTRACT_ABI } from "~/web3/tickets/abi";

const LOTTERY_CONTRACT_ADDRESS = getEnvOrThrowError(
  process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS,
  "NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS"
);

export const LotteryContract = new Contract(
  LOTTERY_CONTRACT_ADDRESS,
  LOTTERY_CONTRACT_ABI
);
