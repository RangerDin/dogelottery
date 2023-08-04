import { RawMetamaskError } from "./declarations";

const isRawMetamaskError = (error: unknown): error is RawMetamaskError => {
  return error instanceof Error && "code" in error;
};

export default isRawMetamaskError;
