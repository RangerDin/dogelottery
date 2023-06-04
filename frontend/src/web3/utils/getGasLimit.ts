import type {
  Web3Provider,
  TransactionRequest
} from "@ethersproject/providers";
import { BigNumberish } from "@ethersproject/bignumber";
import { hexlify } from "@ethersproject/bytes";

export type GetGasLimitOptions = {
  paymentProvider: Web3Provider;
  transactionConfig: TransactionRequest;
  customGasLimit?: number;
};

export const getGasLimit = async ({
  paymentProvider,
  transactionConfig,
  customGasLimit
}: GetGasLimitOptions): Promise<BigNumberish> => {
  let gasLimit: BigNumberish | undefined = customGasLimit;

  if (!gasLimit) {
    gasLimit = await paymentProvider.estimateGas({
      ...transactionConfig
    });
  }

  const gasLimitAsHex = hexlify(gasLimit);

  return gasLimitAsHex;
};
