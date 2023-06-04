import { BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
import type {
  Web3Provider,
  TransactionRequest
} from "@ethersproject/providers";
import { parseEther } from "@ethersproject/units";
import { getGasLimit } from "~/web3/utils/getGasLimit";

type SendTransactionOptions = {
  valueInEthers?: number;
  provider: Web3Provider;
  to: string;
  from: string;
  chainId: number;
  data: BytesLike;
};

type SendTransactionResult = {
  value: BigNumberish;
};

const sendTransaction = async ({
  valueInEthers,
  provider,
  from,
  to,
  chainId,
  data
}: SendTransactionOptions): Promise<SendTransactionResult> => {
  const signer = provider.getSigner();

  const value =
    valueInEthers == null ? undefined : parseEther(String(valueInEthers));

  const transactionConfig: TransactionRequest = {
    value,
    to,
    from,
    data,
    chainId
  };

  const gasLimit = await getGasLimit({
    paymentProvider: provider,
    transactionConfig
  });

  const response = await signer.sendTransaction({
    ...transactionConfig,
    gasLimit
  });

  return {
    value: response.value
  };
};

export default sendTransaction;
