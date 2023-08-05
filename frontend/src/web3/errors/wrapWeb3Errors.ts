import Web3Error from "~/web3/errors/Web3Error";
import {
  ERROR_CODES_BY_MESSAGE,
  RAW_METAMASK_ERROR_CODE_TO_WEB3_ERROR_CODE
} from "./constants";
import { WEB3_ERROR_CODE } from "./declarations";
import isRawMetamaskError from "./isRawMetamaskError";
import isRawMetamaskNestedError from "~/web3/errors/isRawMetamaskNestedError";

const wrapWeb3Errors = async <T>(web3Function: () => T): Promise<T> => {
  try {
    const result = await web3Function();

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    const code = getCodeByError(error);

    throw new Web3Error(errorMessage, code);
  }
};

export default wrapWeb3Errors;

const getCodeByError = (error: unknown): WEB3_ERROR_CODE | undefined => {
  if (isRawMetamaskNestedError(error)) {
    const errorCodeByMessage =
      ERROR_CODES_BY_MESSAGE[error.error?.data?.message ?? ""];

    if (errorCodeByMessage) {
      return errorCodeByMessage;
    }
  }

  const code = isRawMetamaskError(error)
    ? RAW_METAMASK_ERROR_CODE_TO_WEB3_ERROR_CODE[error.code]
    : undefined;

  return code;
};
