import type { Web3Provider } from "@ethersproject/providers";

import { DEFAULT_CHAIN_ID } from "../constants";

export const switchEthereumChain = async (provider: Web3Provider) =>
  await provider.send("wallet_switchEthereumChain", [
    {
      chainId: DEFAULT_CHAIN_ID
    }
  ]);
