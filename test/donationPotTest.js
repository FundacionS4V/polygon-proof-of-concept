const { expect } = require("chai");
const { MockProvider } = require("ethereum-waffle");
const { ethers } = require("hardhat");

describe("DonationPot", () => {
    // create projects with name, api id and wallet address
    const provider = new MockProvider();
    const wallets = provider.getWallets();
    const accounts = [];
    const names = [];
    const apiIds = [];
    for (let index = 0; index < 2; index++) {
        names.push(`Test project number ${index + 1}`);
        apiIds.push(index + 1);
        accounts.push(wallets[index].address);
    }
    it("should be created based on voting choices available and goal amount", async() => {
        const DonationPot = await ethers.getContractFactory("DonationPot");
        const deployedPot = await DonationPot.deploy(
            20000,
            [...names],
            [...apiIds],
            [...accounts]
        );
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
