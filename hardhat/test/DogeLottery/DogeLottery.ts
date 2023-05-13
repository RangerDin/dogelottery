import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { buyTicket } from "./utils";

const BASE_URL = "https://example.com/";
const TICKET_PRICE = 1_000_000_000_000_000_000n;
const RESERVE = TICKET_PRICE * 20n;

describe("DogeLottery", function () {
  async function deployDogeLotteryFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const DogeLotteryFactory = await ethers.getContractFactory("DogeLottery");

    const subscriptionReserve = ethers.utils.parseEther("7");

    const vrfCoordinatorV2MockFactory = await ethers.getContractFactory(
      "VRFCoordinatorV2Mock"
    );

    const baseFee = 0;
    const vrfCoordinatorMock = await vrfCoordinatorV2MockFactory.deploy(
      baseFee,
      0
    );
    const tx = await vrfCoordinatorMock.createSubscription();
    const txReceipt = await tx.wait(1);

    const subscriptionId = txReceipt.events![0].args![0].toNumber();

    await vrfCoordinatorMock.fundSubscription(
      subscriptionId,
      subscriptionReserve
    );

    const dogeLottery = await DogeLotteryFactory.deploy(
      subscriptionId,
      vrfCoordinatorMock.address,
      ethers.utils.formatBytes32String("0x00000012"),
      TICKET_PRICE,
      BASE_URL
    );

    await vrfCoordinatorMock.addConsumer(subscriptionId, dogeLottery.address);

    await owner.sendTransaction({
      to: dogeLottery.address,
      value: RESERVE,
    });

    return {
      dogeLottery,
      vrfCoordinatorMock,
      owner,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should set the right new ticket price", async function () {
      const { dogeLottery } = await loadFixture(deployDogeLotteryFixture);

      const ticketPrice = await dogeLottery.getNewTicketPrice();

      expect(ticketPrice).to.equal(TICKET_PRICE);
    });

    it("Should set the right owner", async function () {
      const { owner, dogeLottery } = await loadFixture(
        deployDogeLotteryFixture
      );

      expect(await dogeLottery.owner()).to.equal(owner.address);
    });

    it("Should set the right baseURL", async function () {
      const { dogeLottery } = await loadFixture(deployDogeLotteryFixture);

      expect(await dogeLottery.getBaseUrl()).to.equal(BASE_URL);
    });

    it("Should receive and store the funds", async function () {
      const { dogeLottery } = await loadFixture(deployDogeLotteryFixture);

      const balance = await ethers.provider.getBalance(dogeLottery.address);

      expect(balance).to.equal(RESERVE);
    });

    it("Should set the right name and symbol", async function () {
      const { dogeLottery } = await loadFixture(deployDogeLotteryFixture);

      await expect(await dogeLottery.name()).to.equal("DogeLotteryTicket");
      await expect(await dogeLottery.symbol()).to.equal("DLT");
    });
  });

  describe("Base URL", function () {
    it("Owner can set new base url", async function () {
      const { dogeLottery } = await loadFixture(deployDogeLotteryFixture);

      const initialBaseUrl = await dogeLottery.getBaseUrl();

      expect(initialBaseUrl).to.equal(BASE_URL);

      const newBaseUrl = "https://doge.lottery/ticket/";

      await dogeLottery.setBaseUrl(newBaseUrl);

      await expect(await dogeLottery.getBaseUrl()).to.equal(newBaseUrl);
    });

    it("Non owner cannot set new base url", async function () {
      const { dogeLottery, otherAccount } = await loadFixture(
        deployDogeLotteryFixture
      );

      const nonOwnerDogeLottery = await dogeLottery.connect(otherAccount);

      const newBaseUrl = "https://doge.lottery/ticket/";

      await expect(
        nonOwnerDogeLottery.setBaseUrl(newBaseUrl)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("New ticket price", function () {
    it("Owner can set new ticket price", async function () {
      const { dogeLottery } = await loadFixture(deployDogeLotteryFixture);

      expect(await dogeLottery.getNewTicketPrice()).to.equal(TICKET_PRICE);

      const newTicketPrice = TICKET_PRICE + 1n;

      await dogeLottery.setNewTicketPrice(newTicketPrice);

      expect(await dogeLottery.getNewTicketPrice()).to.equal(newTicketPrice);
    });

    it("Non owner cannot set new base url", async function () {
      const { dogeLottery, otherAccount } = await loadFixture(
        deployDogeLotteryFixture
      );

      const nonOwnerDogeLottery = await dogeLottery.connect(otherAccount);

      const newTicketPrice = TICKET_PRICE + 1n;

      await expect(
        nonOwnerDogeLottery.setNewTicketPrice(newTicketPrice)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Buy a ticket", () => {
    it("User cannot buy a ticket with incorrect price", async function () {
      const { dogeLottery, otherAccount } = await loadFixture(
        deployDogeLotteryFixture
      );

      const nonOwnerDogeLottery = await dogeLottery.connect(otherAccount);
      const newTicketPrice = await nonOwnerDogeLottery.getNewTicketPrice();
      const differentTicketPrice = newTicketPrice.add(1);

      await expect(
        nonOwnerDogeLottery.buyTicket({
          value: differentTicketPrice,
        })
      ).to.be.revertedWith("You should set exact price");
    });

    it("User can buy a ticket for exact price", async function () {
      const { dogeLottery, otherAccount } = await loadFixture(
        deployDogeLotteryFixture
      );

      const nonOwnerDogeLottery = await dogeLottery.connect(otherAccount);
      const newTicketPrice = await nonOwnerDogeLottery.getNewTicketPrice();

      expect(
        await nonOwnerDogeLottery.balanceOf(otherAccount.address)
      ).to.be.equal(0);

      const tx = await nonOwnerDogeLottery.buyTicket({
        value: newTicketPrice,
      });

      await expect(tx).to.changeEtherBalances(
        [otherAccount, nonOwnerDogeLottery],
        [newTicketPrice.mul(-1), newTicketPrice]
      );

      const txReceipt = await tx.wait(1);

      const ticketId = txReceipt.events![0].args!.tokenId.toNumber();

      expect(
        await nonOwnerDogeLottery.balanceOf(otherAccount.address)
      ).to.be.equal(1);

      expect(await nonOwnerDogeLottery.ownerOf(ticketId)).to.be.equal(
        otherAccount.address
      );
    });
  });

  describe("Open a ticket", async () => {
    it("User cannot open ticket that does not exist", async () => {
      const { dogeLottery, otherAccount } = await loadFixture(
        deployDogeLotteryFixture
      );

      const nonOwnerDogeLottery = dogeLottery.connect(otherAccount);
      const fakeTicketId = 1000;
      const fakeChoice = 1;

      await expect(
        nonOwnerDogeLottery.openTicket(fakeTicketId, fakeChoice)
      ).to.be.revertedWith("Ticket should exist");
    });

    it("User should provide correct choice", async () => {
      const { dogeLottery, otherAccount } = await loadFixture(
        deployDogeLotteryFixture
      );

      const nonOwnerDogeLottery = dogeLottery.connect(otherAccount);

      const ticketId = await buyTicket(nonOwnerDogeLottery);

      const tooLowChoice = 0;

      await expect(
        nonOwnerDogeLottery.openTicket(ticketId, tooLowChoice)
      ).to.be.revertedWith("You should choose from 1 to 5");

      const tooHeighChoice = 6;

      await expect(
        nonOwnerDogeLottery.openTicket(ticketId, tooHeighChoice)
      ).to.be.revertedWith("You should choose from 1 to 5");
    });

    it("User should be an owner of ticket", async () => {
      const { dogeLottery, otherAccount } = await loadFixture(
        deployDogeLotteryFixture
      );

      const ticketId = await buyTicket(dogeLottery);

      const correctChoice = 3;

      const nonOwnerDogeLottery = await dogeLottery.connect(otherAccount);

      await expect(
        nonOwnerDogeLottery.openTicket(ticketId, correctChoice)
      ).to.be.revertedWith("You should be an owner of a ticket");
    });

    it("Owner of ticket should be able to open his ticket", async () => {
      const { dogeLottery } = await loadFixture(deployDogeLotteryFixture);

      const ticketId = await buyTicket(dogeLottery);
      const correctChoice = 3;

      await dogeLottery.openTicket(ticketId, correctChoice);
    });
  });

  describe("fullfilRandomWords", () => {
    it("Request for vrf should exists", async () => {
      const { dogeLottery, vrfCoordinatorMock } = await loadFixture(
        deployDogeLotteryFixture
      );

      const fakeRequest = 1;

      await expect(
        vrfCoordinatorMock.fulfillRandomWords(fakeRequest, dogeLottery.address)
      ).to.be.revertedWith("nonexistent request");
    });

    it("Request cannot be called twice", async () => {
      const { dogeLottery, vrfCoordinatorMock } = await loadFixture(
        deployDogeLotteryFixture
      );

      const ticketId = await buyTicket(dogeLottery);
      const fakeChoice = 5;
      await dogeLottery.openTicket(ticketId, fakeChoice);

      const requestId = 1;

      await expect(
        vrfCoordinatorMock.fulfillRandomWords(requestId, dogeLottery.address)
      ).not.to.be.reverted;

      await expect(
        vrfCoordinatorMock.fulfillRandomWords(requestId, dogeLottery.address)
      ).to.be.revertedWith("nonexistent request");
    });

    it("Non winner choice should not increase winnings", async () => {
      const { dogeLottery, vrfCoordinatorMock, otherAccount } = await loadFixture(
        deployDogeLotteryFixture
      );

      const nonOwnerDogeLottery = await dogeLottery.connect(otherAccount);

      const ticketId = await buyTicket(nonOwnerDogeLottery);
      const nonWinnerChoice = 5;
      await nonOwnerDogeLottery.openTicket(ticketId, nonWinnerChoice);

      const requestId = 1;

      await expect(
        vrfCoordinatorMock.fulfillRandomWords(requestId, dogeLottery.address)
      ).not.to.be.reverted;

      const nonOwnerWinnings = await nonOwnerDogeLottery.winnings();
      await expect(nonOwnerWinnings).to.equal(0);

      const ownerWinnings = await dogeLottery.winnings();
      await expect(ownerWinnings).to.equal(TICKET_PRICE);
    });

    it("Winner choice should increase winnings", async () => {
      const { dogeLottery, vrfCoordinatorMock } = await loadFixture(
        deployDogeLotteryFixture
      );

      const newTicketPrice = await dogeLottery.getNewTicketPrice();
      const ticketId = await buyTicket(dogeLottery);
      const winnerChoice = 1;
      await dogeLottery.openTicket(ticketId, winnerChoice);

      const requestId = 1;

      await expect(
        vrfCoordinatorMock.fulfillRandomWords(requestId, dogeLottery.address)
      ).not.to.be.reverted;

      const winnings = await dogeLottery.winnings();
      const prizeRatio = await dogeLottery.PRIZE_RATIO();
      const expectedWinnings = newTicketPrice.mul(prizeRatio);

      await expect(winnings.toString()).to.equal(expectedWinnings.toString());
    });
  });

  describe("withdrawWinnings", () => {
    it("User cannot withdraw zero winnings", async () => {
      const { dogeLottery } = await loadFixture(
        deployDogeLotteryFixture
      );

      const winnings = await dogeLottery.winnings();

      expect(winnings.toString()).to.equal("0");

      await expect(dogeLottery.withdrawWinnings()).to.be.revertedWith(
        "You don't have any winnings"
      );
    });

    it("User can withdraw winnings", async () => {
      const { dogeLottery, owner, vrfCoordinatorMock } = await loadFixture(
        deployDogeLotteryFixture
      );

      const newTicketPrice = await dogeLottery.getNewTicketPrice();
      const ticketId = await buyTicket(dogeLottery);
      const winnerChoice = 1;
      await dogeLottery.openTicket(ticketId, winnerChoice);
      const requestId = 1;

      await vrfCoordinatorMock.fulfillRandomWords(
        requestId,
        dogeLottery.address
      );

      const prizeRatio = await dogeLottery.PRIZE_RATIO();
      const expectedWinnings = newTicketPrice.mul(prizeRatio);

      const tx = await dogeLottery.withdrawWinnings();

      await expect(tx).to.changeEtherBalances(
        [owner, dogeLottery],
        [expectedWinnings, expectedWinnings.mul(-1)]
      );
    });
  });
});
