import { ethers, network } from "hardhat";
import { OPTIONS_BY_CHAIN_ID } from "./constants";

async function main() {
  const chainId = network.config.chainId;

  if (!chainId) {
    throw new Error("chainId isn't set");
  }

  const options = OPTIONS_BY_CHAIN_ID[chainId];

  if (!options) {
    throw new Error(`There is not options for ${chainId} chainId`);
  }

  const dogeTokenFactory = await ethers.getContractFactory(
    "TestDogeToken"
  );
  const dogeToken = await dogeTokenFactory.deploy(options.dogeTokenRequestAmount);
  await dogeToken.deployed();
  const dogeTokenAddress = dogeToken.address;

  console.log(
    `TestDogeToken was deployed: ${dogeTokenAddress}\n`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
