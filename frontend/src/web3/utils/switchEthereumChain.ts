import type { Web3Provider } from "@ethersproject/providers";

import { DEFAULT_CHAIN_OPTIONS } from "../constants";

const CHAIN_HAS_NOT_BEEN_ADDED = 4902;

export const switchEthereumChain = async (provider: Web3Provider) => {
  try {
    await provider.send("wallet_switchEthereumChain", [
      {
        chainId: DEFAULT_CHAIN_OPTIONS.chainId
      }
    ]);
  } catch (error) {
    console.log({ error });
    if (
      error instanceof Error &&
      "code" in error &&
      error.code !== CHAIN_HAS_NOT_BEEN_ADDED
    ) {
      throw error;
    }

    await provider.send("wallet_addEthereumChain", [DEFAULT_CHAIN_OPTIONS]);
  }
};
