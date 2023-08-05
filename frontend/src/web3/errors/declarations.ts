export enum RAW_METAMASK_ERROR_CODE {
  ACTION_REJECTED = "ACTION_REJECTED",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS"
}

export enum WEB3_ERROR_CODE {
  INSUFFICIENT_FUNDS = "Insufficient funds",
  USER_CANCELLED_OPERATION = "User cancelled operation",
  SOMETHING_WRONG = "Something went wrong",
  TOKENS_ALREADY_REQUESTED = "Tokens already requested.\nTry again in a day"
}

export type RawMetamaskError = Error & {
  code: RAW_METAMASK_ERROR_CODE;
};

export type RawMetamaskNestedError = Error & {
  error: {
    data?: {
      message?: string;
    };
  };
};
