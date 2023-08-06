import { Contract } from "@ethersproject/contracts";
import { DOGE_TOKEN_CONTRACT_ABI } from "./abi";
import { getEnvOrThrowError } from "~/utils/envs";

const DOGE_TOKEN_CONTRACT_ADDRESS = getEnvOrThrowError(
  process.env.NEXT_PUBLIC_DOGE_TOKEN_CONTRACT_ADDRESS,
  "NEXT_PUBLIC_DOGE_TOKEN_CONTRACT_ADDRESS"
);

export const DogeTokenContract = new Contract(
  DOGE_TOKEN_CONTRACT_ADDRESS,
  DOGE_TOKEN_CONTRACT_ABI
);
