import Web3Error from "~/web3/errors/Web3Error";

const wrapWeb3Errors = async <T>(web3Function: () => T): Promise<T> => {
  try {
    const result = await web3Function();

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    throw new Web3Error(errorMessage);
  }
};

export default wrapWeb3Errors;
