require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("guess", "Takes a guess on GuessGame")
  .addParam("number", "User's guess")
  .setAction(async (taskArgs, hre) => {
    const ADDRESS = process.env.CONTRACT_ADDRESS;
    const guessGame = await hre.ethers.getContractAt(
      "GuessGame",
      ADDRESS
    );
    const result = await guessGame.takeGuess(taskArgs.number);
    console.log(result);
  });



// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const {API_URL, PRIVATE_KEY} = process.env;
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
};
