import Web3Error from "~/web3/errors/Web3Error";
import { ERROR_CODES_TO_IGNORE } from "./constants";
import { WEB3_ERROR_CODE } from "./declarations";
import useToast from "~/ui/toasts/useToast";
import { TOAST_VARIANT } from "~/ui/toasts/declarations";

export type Web3ErrorHandler = (
  web3Function: () => Promise<void>
) => Promise<void>;

type UseWeb3ErrorsHandlerResult = Web3ErrorHandler;

const useWeb3ErrorsHandler = (): UseWeb3ErrorsHandlerResult => {
  const { toast } = useToast();

  const handleWeb3Error: Web3ErrorHandler = async web3Function => {
    try {
      await web3Function();
    } catch (error) {
      if (error instanceof Web3Error && ERROR_CODES_TO_IGNORE.has(error.code)) {
        return;
      }

      const errorMessage =
        error instanceof Web3Error
          ? error.code
          : WEB3_ERROR_CODE.SOMETHING_WRONG;

      toast(errorMessage, {
        variant: TOAST_VARIANT.ERROR
      });
    }
  };

  return handleWeb3Error;
};

export default useWeb3ErrorsHandler;
