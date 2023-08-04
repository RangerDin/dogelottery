import Web3Error from "~/web3/errors/Web3Error";
import { RAW_METAMASK_ERROR_CODE_TO_WEB3_ERROR_CODE } from "~/web3/errors/constants";
import isRawMetamaskError from "~/web3/errors/isRawMetamaskError";

const wrapWeb3Errors = async <T>(web3Function: () => T): Promise<T> => {
  try {
    const result = await web3Function();

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    const code = isRawMetamaskError(error)
      ? RAW_METAMASK_ERROR_CODE_TO_WEB3_ERROR_CODE[error.code]
      : undefined;

    throw new Web3Error(errorMessage, code);
  }
};

export default wrapWeb3Errors;
