import { getEnvOrThrowError } from "~/utils/envs";
import { ChainOptions } from "~/web3/declarations";

const getDefaultChainOptions = (): ChainOptions => {
  const rawEnvData = getEnvOrThrowError(
    process.env.NEXT_PUBLIC_CHAIN,
    "NEXT_PUBLIC_CHAIN"
  );

  try {
    const chainOptions = JSON.parse(rawEnvData);

    return chainOptions;
  } catch (error) {
    throw new Error("Incorrect format of NEXT_PUBLIC_CHAIN env variable");
  }
};

export const DEFAULT_CHAIN_OPTIONS = getDefaultChainOptions();
