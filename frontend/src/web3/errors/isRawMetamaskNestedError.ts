import { RawMetamaskNestedError } from "./declarations";

const isRawMetamaskNestedError = (
  error: unknown
): error is RawMetamaskNestedError => {
  return (
    error instanceof Error &&
    "error" in error &&
    typeof error.error === "object"
  );
};

export default isRawMetamaskNestedError;
