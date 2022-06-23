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
    for (let index = 0; index < 3; index++) {
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
        const tx = await donors[4].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        await tx.wait();
        expect(await provider.getBalance(deployedPot.address)).to.equal(100);
        expect(await deployedPot.getDonationsFrom(donors[4].address)).to.equal(100);
    });
    it("should allow an investor to add more money to the pot", async() => {
        let tx = await donors[4].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        tx = await donors[5].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        tx = await donors[5].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        await tx.wait();
        expect(await provider.getBalance(deployedPot.address)).to.equal(300);
        expect(await deployedPot.getDonationsFrom(donors[5].address)).to.equal(200);
    });
    it("should return donors and donations in order to build current pot composition {donor: donation}", async() => {
        const donationObjects = {
            [donors[4].address]: {
                signer: donors[4],
                donation: 25
            },
            [donors[5].address]: {
                signer: donors[5],
                donation: 100
            },
            [donors[6].address]: {
                signer: donors[6],
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
        let tx = await donors[4].sendTransaction({
            to: deployedPot.address,
            value: 100
        });
        await tx.wait();
        await expect(deployedPot.connect(donors[4]).vote(2)).to.be.revertedWith("pot goal has not been reached; no voting allowed yet.");
    });
    it("should not allow voting after fifteen (15) days have passed since goal amount was reached", async() => {
        let tx = await donors[4].sendTransaction({
            to: deployedPot.address,
            value: 21000
        });
        await tx.wait();
        await provider.send('evm_increaseTime', [15 * 24 * 60 * 60]);
        await provider.send('evm_mine');
        await expect(deployedPot.connect(donors[4]).vote(1)).to.be.revertedWith("sorry, voting window is closed.");
    });
    it("should return voting results after window is over because everyone voted", async() => {
        const donationObjects = [{
            signer: donors[4],
            donation: 2500,
            vote: 1,
        }, {
            signer: donors[5],
            donation: 10000,
            vote: 1
        }, {
            signer: donors[6],
            donation: 43100,
            vote: 3
        }];
        let tx;
        for (let donationObject of donationObjects) {
            tx = await donationObject.signer.sendTransaction({
                to: deployedPot.address,
                value: donationObject.donation
            });
        }
        await tx.wait();
        for (let donationObject of donationObjects) {
            tx = await deployedPot.connect(
                donationObject.signer
            ).vote(donationObject.vote);
        }
        await tx.wait();
        const [winnerId, winnerAddress, transferedFunds] = await deployedPot.getWinner();
        expect(winnerId).to.equal(3);
        expect(winnerAddress).to.equal(wallets[2].address);
        expect(transferedFunds).to.equal(55600);
    });
    it("should return voting results after window is over because voting deadline is reached", async() => {
        const donationObjects = [{
            signer: donors[4],
            donation: 2500,
            vote: 1,
        }, {
            signer: donors[5],
            donation: 10000,
            vote: 1
        }, {
            signer: donors[6],
            donation: 43100,
            vote: 3
        }];
        let tx;
        for (let donationObject of donationObjects) {
            tx = await donationObject.signer.sendTransaction({
                to: deployedPot.address,
                value: donationObject.donation
            });
        }
        await tx.wait();
        const lateOne = donationObjects.pop();
        for (let donationObject of donationObjects) {
            tx = await deployedPot.connect(
                donationObject.signer
            ).vote(donationObject.vote);
        }
        await tx.wait();
        await provider.send('evm_increaseTime', [16 * 24 * 60 * 60]);
        await provider.send('evm_mine');
        await expect(deployedPot.getWinner()).to.be.revertedWith(
            "no winner yet, execute countVotes if 15 day voting window is over and try again."
        )
        await deployedPot.countVotes();
        const [winnerId, winnerAddress, transferedFunds] = await deployedPot.getWinner();
        expect(winnerId).to.equal(1);
        expect(winnerAddress).to.equal(wallets[0].address);
        expect(transferedFunds).to.equal(55600);
    });
    it("should send pot money to winning choice wallet right after vote has ended", async() => {
        const initialBalance = await provider.getBalance(wallets[2].address);
        const donationObjects = [{
            signer: donors[4],
            donation: 2500,
            vote: 1,
        }, {
            signer: donors[5],
            donation: 10000,
            vote: 1
        }, {
            signer: donors[6],
            donation: 43100,
            vote: 3
        }];
        let tx;
        for (let donationObject of donationObjects) {
            tx = await donationObject.signer.sendTransaction({
                to: deployedPot.address,
                value: donationObject.donation
            });
        }
        await tx.wait();
        for (let donationObject of donationObjects) {
            tx = await deployedPot.connect(
                donationObject.signer
            ).vote(donationObject.vote);
        }
        await tx.wait();
        const [winnerId, winnerAddress, transferedFunds] = await deployedPot.getWinner();
        expect(winnerId).to.equal(3);
        expect(winnerAddress).to.equal(wallets[2].address);
        expect(transferedFunds).to.equal(55600);
        const finalBalance = await provider.getBalance(winnerAddress);
        expect(finalBalance.sub(initialBalance).toNumber()).to.equal(55600);
        expect(await provider.getBalance(deployedPot.address)).to.equal(0);
    });
});
