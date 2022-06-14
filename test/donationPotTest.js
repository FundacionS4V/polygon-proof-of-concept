const { expect } = require("chai");
const { MockProvider } = require("ethereum-waffle");
const { ethers } = require("hardhat");

describe("DonationPot", () => {
    const provider = new MockProvider();
    const wallets = provider.getWallets();
    const choices = wallets.slice(4).map(
        (wallet, index) => {
            return [{
                address: wallet.address,
                name: `Test project number ${index}`
            }];
    });
    it("should be created based on voting choices available and goal amount", async() => {
        const DonationPot = await ethers.getContractFactory("DonationPot");
        const deployedPot = await DonationPot.deploy({
            choices: choices,
            goal: 20000
        });
        await deployedPot.deployed();
        expect(deployedPot.address).to.exist;
    });
    it("should allow an investor to add money to the pot", async() => {});
    it("should allow an investor to add more money to the pot", async() => {});
    it("should return current pot composition (donor: amount)", async() => {});
    it("should not allow any voting to occur up until goal amount has been reached", async() => {});
    it("should not allow voting after fifteen (15) days have passed since goal amount was reached", async() => {});
    it("should return voting results after window is over because everyone voted", async() => {});
    it("should return voting results after window is over because voting deadline is reached", async() => {});
    it("should send pot money to winning choice wallet right after vote has ended", async() => {});
});
