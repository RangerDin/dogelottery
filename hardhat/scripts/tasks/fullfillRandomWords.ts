import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const TEST_CHAIN_ID = 31337;

async function fullfillRandomWords(
  hre: HardhatRuntimeEnvironment,
  {
    vrfAddress,
    dogeLotteryAddress,
    requestId,
  }: {
    vrfAddress: string;
    dogeLotteryAddress: string;
    requestId: string;
  }
) {
  const chainId = hre.network.config.chainId;

  if (!chainId) {
    throw new Error("chainId isn't set");
  }

  if (chainId !== TEST_CHAIN_ID) {
    throw new Error(`chainId should be equal to ${TEST_CHAIN_ID}`);
  }

  const vrfCoordinatorFactory = await hre.ethers.getContractAt(
    "VRFCoordinatorV2Mock",
    vrfAddress
  );

  await vrfCoordinatorFactory.fulfillRandomWords(requestId, dogeLotteryAddress);
}

task("fullfill", "Fullfill random words for test environment")
  .addPositionalParam("vrfAddress")
  .addPositionalParam("dogeLotteryAddress")
  .addPositionalParam("requestId")
  .setAction(async (taskArgs, hre) => {
    return fullfillRandomWords(hre, {
      vrfAddress: taskArgs.vrfAddress,
      dogeLotteryAddress: taskArgs.dogeLotteryAddress,
      requestId: taskArgs.requestId,
    });
  });
