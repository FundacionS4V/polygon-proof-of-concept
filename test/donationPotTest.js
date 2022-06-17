const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("DonationPot", () => {
    let DonationPot;
    let deployedPot;
    let donors;
    const provider = waffle.provider;
    const wallets = provider.getWallets();
    const accounts = [];
    const names = [];
    const apiIds = [];
    for (let index = 0; index < 2; index++) {
        names.push(`Test project number ${index + 1}`);
        apiIds.push(index + 1);
        accounts.push(wallets[index].address);
    }
    beforeEach(async function () {
        DonationPot = await ethers.getContractFactory("DonationPot");
        deployedPot = await DonationPot.deploy(
            20000,
            [...names],
            [...apiIds],
            [...accounts]
        );
        await deployedPot.deployed();
        donors = await ethers.getSigners();
    });
    it("should be created based on voting choices available and goal amount", async() => {
        expect(await provider.getBalance(deployedPot.address)).to.equal(0);
    });
    it("should allow a donor to add money to the pot", async() => {
        const tx = await donors[1].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        await tx.wait();
        expect(await provider.getBalance(deployedPot.address)).to.equal(100);
        expect(await deployedPot.getDonationsBy(donors[1].address)).to.equal(100);
    });
    it("should allow an investor to add more money to the pot", async() => {
        let tx = await donors[1].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        tx = await donors[2].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        tx = await donors[2].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        await tx.wait();
        expect(await provider.getBalance(deployedPot.address)).to.equal(300);
        expect(await deployedPot.getDonationsBy(donors[2].address)).to.equal(200);
    });
    it("should return current pot composition {donor: amount}", async() => {});
    it("should not allow any voting to occur up until goal amount has been reached", async() => {});
    it("should not allow voting after fifteen (15) days have passed since goal amount was reached", async() => {});
    it("should return voting results after window is over because everyone voted", async() => {});
    it("should return voting results after window is over because voting deadline is reached", async() => {});
    it("should send pot money to winning choice wallet right after vote has ended", async() => {});
});
