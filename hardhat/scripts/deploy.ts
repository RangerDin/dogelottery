import { ethers, network } from "hardhat";
import { BigNumberish, BytesLike } from "ethers";

type DogeLotteryOptions = {
  subscriptionId: BigNumberish;
  vrfCoordinatorAddress: string;
  vrfGasLaneHash: BytesLike;
  newTicketPrice: BigNumberish;
  baseURL: string;
  dogeTokenAddress: string;
  dogeTokenRequestAmount: BigNumberish;
};

const TEST_CHAIN_ID = 31337;

const OPTIONS_BY_CHAIN_ID: Record<number, DogeLotteryOptions> = {
  [TEST_CHAIN_ID]: {
    baseURL: "https://doge.lottery/ticket/",
    newTicketPrice: 1_000_000_000_000n,
    subscriptionId: "",
    vrfGasLaneHash: ethers.utils.formatBytes32String("0x00000012"),
    vrfCoordinatorAddress: "",
    dogeTokenAddress: "",
    dogeTokenRequestAmount : 1_000_000_000_000_000n
  },
  80001: {
    baseURL: "https://doge.lottery/ticket/",
    newTicketPrice: 1_000_000_000_000n,
    subscriptionId: "",
    vrfGasLaneHash: "",
    vrfCoordinatorAddress: "",
    dogeTokenAddress: "",
    dogeTokenRequestAmount : 1_000_000_000_000_000n
  },
};

async function main() {
  const chainId = network.config.chainId;

  if (!chainId) {
    throw new Error("chainId isn't set");
  }

  const options = OPTIONS_BY_CHAIN_ID[chainId];

  if (!options) {
    throw new Error(`There is not options for ${chainId} chainId`);
  }

  let subscriptionId: BigNumberish;
  let vrfCoordinatorAddress: string;
  let dogeTokenAddress: string;

  let vrfCoordinator;
  if (chainId === TEST_CHAIN_ID) {
    const vrfCoordinatorFactory = await ethers.getContractFactory(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinator = await vrfCoordinatorFactory.deploy(0, 0);
    const tx = await vrfCoordinator.createSubscription();
    const txReceipt = await tx.wait();

    subscriptionId = txReceipt.events![0].args![0].toNumber();
    const subscriptionReserve = ethers.utils.parseEther("7");

    await vrfCoordinator.fundSubscription(
      subscriptionId,
      subscriptionReserve
    );

    vrfCoordinatorAddress = vrfCoordinator.address;

    const dogeTokenFactory = await ethers.getContractFactory(
      "TestDogeToken"
    );

    const dogeToken = await dogeTokenFactory.deploy(options.dogeTokenRequestAmount);

    dogeTokenAddress = dogeToken.address;
  } else {
    subscriptionId = options.subscriptionId;
    vrfCoordinatorAddress = options.vrfCoordinatorAddress;
    dogeTokenAddress = options.dogeTokenAddress;
  }

  const DogeLotteryFactory = await ethers.getContractFactory("DogeLottery");
  const dogeLottery = await DogeLotteryFactory.deploy(
    subscriptionId,
    vrfCoordinatorAddress,
    dogeTokenAddress,
    options.vrfGasLaneHash,
    options.newTicketPrice,
    options.baseURL
  );

  if (chainId === TEST_CHAIN_ID && vrfCoordinator) {
    await vrfCoordinator.addConsumer(subscriptionId, dogeLottery.address);
  }

  await dogeLottery.deployed();

  const lotteryOwnerAddress = await dogeLottery.owner();

  console.log(
    `
      DogeLottery contract was deployed to ${dogeLottery.address}. (Owner: ${lotteryOwnerAddress})\n
      DogeToken was deployed: ${dogeTokenAddress}\n
      VRF coordinator address: ${vrfCoordinatorAddress}
    `
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
