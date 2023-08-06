import { configDotenv } from 'dotenv';
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";

import "./scripts/tasks/fullfillRandomWords";
import { MUMBAI_CHAIN_ID, TEST_CHAIN_ID } from "./constants/networks";
import { PATH_TO_ENV_FILE } from './constants/env';
import { getEnvOrThrowError } from './utils/envs';

configDotenv({
  path: PATH_TO_ENV_FILE,
});

const signerAddress = getEnvOrThrowError(process.env.DOGE_LOTTERY_SIGNER_PRIVATE_KEY, "DOGE_LOTTERY_SIGNER_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: TEST_CHAIN_ID,
    },
    localhost: {
      chainId: TEST_CHAIN_ID,
    },
    mumbai: {
      chainId: MUMBAI_CHAIN_ID,
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [signerAddress]
    }
  }
};

export default config;
