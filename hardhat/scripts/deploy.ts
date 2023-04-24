import { ethers } from "hardhat";

async function main() {
  const DogeLotteryFactory = await ethers.getContractFactory("DogeLottery");
  const dogeLottery = await DogeLotteryFactory.deploy();

  await dogeLottery.deployed();

  const ownerAddress = await dogeLottery.owner();

  console.log(
    `DogeLottery contract with ${ownerAddress} owner was deployed to ${dogeLottery.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
