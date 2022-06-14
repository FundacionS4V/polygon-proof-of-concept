const { ethers } = require("hardhat");

async function main() {
    const GuessGame = await ethers.getContractFactory("GuessGame");
    const guessGame = await GuessGame.deploy();
    console.log("Contract deployed to address:", guessGame.address);
};

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
