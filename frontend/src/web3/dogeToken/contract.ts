import { Contract } from "@ethersproject/contracts";
import { DOGE_TOKEN_CONTRACT_ABI } from "./abi";

const DOGE_TOKEN_CONTRACT_ADDRESS =
  "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

export const DogeTokenContract = new Contract(
  DOGE_TOKEN_CONTRACT_ADDRESS,
  DOGE_TOKEN_CONTRACT_ABI
);
