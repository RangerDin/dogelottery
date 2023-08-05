import type { Web3Provider } from "@ethersproject/providers";
import { switchEthereumChain } from "../utils/switchEthereumChain";
import { DogeTokenContract } from "~/web3/dogeToken/contract";

export const requestTokens = async (provider: Web3Provider): Promise<void> => {
  const signer = provider.getSigner();

  const dogeTokenContract = DogeTokenContract.connect(signer);

  await switchEthereumChain(provider);

  const tx = await dogeTokenContract.requestTokens();

  await tx.wait(1);
};
