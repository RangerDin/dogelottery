import { toast } from "react-hot-toast";
import Web3Error from "~/web3/errors/Web3Error";
import { WEB3_ERROR_CODE } from "~/web3/errors/declarations";

export type Web3ErrorHandler = (
  web3Function: () => Promise<void>
) => Promise<void>;

type UseWeb3ErrorsHandlerResult = Web3ErrorHandler;

const ERROR_TOAST_COLOR = "#f00";

const useWeb3ErrorsHandler = (): UseWeb3ErrorsHandlerResult => {
  const handleWeb3Error: Web3ErrorHandler = async web3Function => {
    try {
      await web3Function();
    } catch (error) {
      const errorMessage =
        error instanceof Web3Error
          ? error.code
          : WEB3_ERROR_CODE.SOMETHING_WRONG;

      toast(errorMessage, {
        style: {
          color: ERROR_TOAST_COLOR
        }
      });
    }
  };

  return handleWeb3Error;
};

export default useWeb3ErrorsHandler;
