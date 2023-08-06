import { ethers } from "hardhat";

import { DogeLotteryOptions } from "./declarations";
import { MUMBAI_CHAIN_ID, TEST_CHAIN_ID } from "../constants/networks";
import { getEnvOrThrowError } from "../utils/envs";

export const RESERVE_IN_TICKETS = 20n;

const TEST_TICKET_PRICE = 1_000_000_000_000n;

const MUMBAI_TICKET_PRICE = BigInt(getEnvOrThrowError(process.env.DOGE_LOTTERY_NEW_TICKET_PRICE, "DOGE_LOTTERY_NEW_TICKET_PRICE"));

export const OPTIONS_BY_CHAIN_ID: Record<number, DogeLotteryOptions> = {
  [TEST_CHAIN_ID]: {
    baseURL: "https://doge.lottery/ticket/",
    newTicketPrice: TEST_TICKET_PRICE,
    subscriptionId: "",
    vrfGasLaneHash: ethers.utils.formatBytes32String("0x00000012"),
    vrfCoordinatorAddress: "",
    dogeTokenAddress: "",
    dogeTokenRequestAmount: RESERVE_IN_TICKETS * TEST_TICKET_PRICE
  },
  [MUMBAI_CHAIN_ID]: {
    baseURL: getEnvOrThrowError(process.env.DOGE_LOTTERY_BASE_URL, "DOGE_LOTTERY_BASE_URL"),
    newTicketPrice: MUMBAI_TICKET_PRICE,
    subscriptionId: getEnvOrThrowError(process.env.DOGE_LOTTERY_SUBSCRIPTION_ID, "DOGE_LOTTERY_SUBSCRIPTION_ID"),
    vrfGasLaneHash: getEnvOrThrowError(process.env.DOGE_LOTTERY_VRF_GAS_LANE_HASH, "DOGE_LOTTERY_VRF_GAS_LANE_HASH"),
    vrfCoordinatorAddress: getEnvOrThrowError(process.env.DOGE_LOTTERY_VRF_COORDINATOR_ADDRESS, "DOGE_LOTTERY_VRF_COORDINATOR_ADDRESS"),
    dogeTokenAddress: getEnvOrThrowError(process.env.DOGE_LOTTERY_DOGE_TOKEN_ADDRESS, "DOGE_LOTTERY_DOGE_TOKEN_ADDRESS"),
    dogeTokenRequestAmount: RESERVE_IN_TICKETS * MUMBAI_TICKET_PRICE
  },
};
