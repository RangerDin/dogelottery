import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const TICKET_PRICE = 10n;
const TOKENS_TO_GIVE = TICKET_PRICE * 20n;

describe("TestDogeToken", function () {
  async function deployTestDogeTokenFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const testDogeTokenFactory = await ethers.getContractFactory(
      "TestDogeToken"
    );

    const dogeToken = await testDogeTokenFactory.deploy(TOKENS_TO_GIVE);

    const otherAccountDogeToken = dogeToken.connect(otherAccount);

    return {
      dogeToken,
      owner,
      otherAccount,
      otherAccountDogeToken
    };
  }

  describe("Token request", function () {
    it("User can request specified amount of tokens if he has not requested it yet", async function () {
      const { dogeToken, otherAccount, otherAccountDogeToken } = await loadFixture(deployTestDogeTokenFixture);

      const tx = await otherAccountDogeToken.requestTokens();

      await expect(tx).to.changeTokenBalances(
        dogeToken,
        [otherAccount],
        [TOKENS_TO_GIVE]
      );
    });

    it("User can not request specified amount of tokens if he has already requested it recently", async function () {
      const { otherAccountDogeToken } = await loadFixture(deployTestDogeTokenFixture);

      await otherAccountDogeToken.requestTokens();

      await expect(otherAccountDogeToken.requestTokens()).to.be.revertedWith(
        "TestDogeToken: you can't request tokens yet"
      );
    });


    it("User can request specified amount of tokens if lock time is over", async function () {
      const { dogeToken, otherAccount, otherAccountDogeToken } = await loadFixture(deployTestDogeTokenFixture);

      await otherAccountDogeToken.requestTokens();

      const oneDay = 60 * 60 * 24 + 1;
      await ethers.provider.send("evm_increaseTime", [oneDay]);

      const tx = await otherAccountDogeToken.requestTokens();

      await expect(tx).to.changeTokenBalances(
        dogeToken,
        [otherAccount],
        [TOKENS_TO_GIVE]
      );
    });
  });
});
