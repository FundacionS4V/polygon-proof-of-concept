const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("GuessGame", () => {
    it("should handle a guess from a player", async() => {
        const GuessGame = await ethers.getContractFactory("GuessGame");
        const guessGame = await GuessGame.deploy();
        await guessGame.deployed();
        const guess = await guessGame.takeGuess(50);
        await guess.wait();
        console.log("THIS IS GUESS RESULT??", guess);
        expect(guess).to.exist;
    });
    it("has a randomNumber", async() => {
        const GuessGame = await ethers.getContractFactory("GuessGame");
        const guessGame = await GuessGame.deploy();
        await guessGame.deployed();
        const currentNumber = await guessGame.revealNumber();
        console.log("THIS IS NUMBER:", currentNumber);
        expect(currentNumber).to.be.instanceOf(Number);
    })
})