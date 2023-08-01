import { Contract } from "@ethersproject/contracts";
import { DOGE_TOKEN_CONTRACT_ABI } from "./abi";

const DOGE_TOKEN_CONTRACT_ADDRESS =
  "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

export const DogeTokenContract = new Contract(
  DOGE_TOKEN_CONTRACT_ADDRESS,
  DOGE_TOKEN_CONTRACT_ABI
);
