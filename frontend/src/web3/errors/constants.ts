import { RAW_METAMASK_ERROR_CODE, WEB3_ERROR_CODE } from "./declarations";

export const RAW_METAMASK_ERROR_CODE_TO_WEB3_ERROR_CODE: Record<
  RAW_METAMASK_ERROR_CODE,
  WEB3_ERROR_CODE | undefined
> = {
  [RAW_METAMASK_ERROR_CODE.ACTION_REJECTED]:
    WEB3_ERROR_CODE.USER_CANCELLED_OPERATION,
  [RAW_METAMASK_ERROR_CODE.INSUFFICIENT_FUNDS]:
    WEB3_ERROR_CODE.INSUFFICIENT_FUNDS
};

export const ERROR_CODES_TO_IGNORE: Set<WEB3_ERROR_CODE> = new Set([
  WEB3_ERROR_CODE.USER_CANCELLED_OPERATION
]);

export const ERROR_CODES_BY_MESSAGE: Record<
  string,
  WEB3_ERROR_CODE | undefined
> = {
  "Error: VM Exception while processing transaction: reverted with reason string 'TestDogeToken: you can't request tokens yet'":
    WEB3_ERROR_CODE.TOKENS_ALREADY_REQUESTED
};
