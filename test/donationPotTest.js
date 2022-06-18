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
        expect(await deployedPot.getDonationsFrom(donors[1].address)).to.equal(100);
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
        expect(await deployedPot.getDonationsFrom(donors[2].address)).to.equal(200);
    });
    it("should return donors and donations in order to build current pot composition {donor: donation}", async() => {
        const donationObjects = {
            [donors[1].address]: {
                signer: donors[1],
                donation: 25
            },
            [donors[2].address]: {
                signer: donors[2],
                donation: 100
            },
            [donors[3].address]: {
                signer: donors[3],
                donation: 431
            }
        };
        let tx;
        for (let address in donationObjects) {
            tx = await donationObjects[address].signer.sendTransaction({
                to: deployedPot.address,
                value: donationObjects[address].donation
            });
        }
        await tx.wait();
        const donorAddresses = await deployedPot.getDonors();
        expect(donorAddresses.length).to.equal(3);
        for (let donorAddress of donorAddresses) {
            const donationFrom = await deployedPot.getDonationsFrom(
                donorAddress
            );
            expect(donationFrom).to.equal(donationObjects[donorAddress].donation);
        }
    });
    it("should not allow any voting to occur up until goal amount has been reached", async() => {
        let tx = await donors[1].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        await tx.wait();
        await expect(deployedPot.connect(donors[1]).vote(2)).to.be.revertedWith("pot goal has not been reached; no voting allowed yet.");
    });
    it("should not allow voting after fifteen (15) days have passed since goal amount was reached", async() => {
        let tx = await donors[1].sendTransaction({
            to: deployedPot.address,
            value: 21000
        });
        await tx.wait();
        await provider.send('evm_increaseTime', [15 * 24 * 60 * 60]);
        await expect(deployedPot.connect(donors[1]).vote(1)).to.be.revertedWith("sorry, voting window is closed.");
    });
    it("should return voting results after window is over because everyone voted", async() => {});
    it("should return voting results after window is over because voting deadline is reached", async() => {});
    it("should send pot money to winning choice wallet right after vote has ended", async() => {});
});
