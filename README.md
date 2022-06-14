# s4v smart contract proof of concept

a proof of concept for s4v platform funding smart contract process on ETH polygon network


## Guess Game tutorial contract

---

### init repo and npm

```shell
# node:16
$ git init
$ npm init
```

---

### install hardhat & create project

```shell
$ npm i -D hardhat
$ npx hardhat
```

---

### install dotenv & create .env file
```shell
$ npm i -S dotenv
$ echo "ENV_VAR='some value'" >> .env
```

---

### create first solidity test contract
check `./contracts/GuessGame.sol` to read this game's contract:
- sets a random number [1, 100] on deployment for players to guess 
- signs players up when they take their first guess
- has a function for players to take a guess; they have up to 5 attempts
- updates game status on every player attempt

---

## get test credits for Mumbai Testnet
go to [polygon's](https://faucet.polygon.technology) or [mumbai's](https://mumbaifaucet.com) faucets and input your wallet so that you can ask for MATIC credits for Mumbai Testnet

---

## compile & deploy contract on Mumbai Testnet
complete hardhat.config.js file before compiling and run
```shell
$ npx hardhat compile
```
validate contract artifacts are created on `./artifacts` and create deploy script at `./scripts/deploy.js` in order to run
```shell
$ npx hardhat run ./scripts/deploy.js --network polygon_mumbai
```
check output on terminal, it should read something like `Contract deployed to address: 0x...`, take note of this address as it represents deployed contract.

---

## check contract has been deployed
go to [Polygon Testnet Explorer](https://mumbai.polygonscan.com) and input contract's address on search bar; it should take you to our deployed contract detail view. 

check transaction corresponding to contract creation; in this example it doesn't cost a specific amount of MATIC but what had to be paid as transaction fees.

in this case, for our test, paid fee was `0.001163597789 MATIC` coins, equivalent to `$0.001`.
now check your own wallet and you should see the same transaction and your updated MATIC balance.

---

## add tasks to interact with contract
on this hardhat.config.js file add a task declaration to create a new task, i.e.: `guess`, to interact with out contract through a public method, just like `takeGuess`.

this task will be listed by hardhat on help `$ npx hardhat --help` and may be used through
```shell
# npx hardhat <taskName> <--params values>
$ npx hardhat guess --number 15
```

---

## add unit tests
tests should be always written before any value code, but this being a guided learning process it made sense to start hands on value code; in order to write tests `mocha` dep needs to be installed
```shell
$ npm i -D mocha
```
add test file on `./test` folder and run it using
```shell
$ npx hardhat test ./test/guessGameTest.js
```
this will run tests as written; if contract is deployed for a test, it will be deployed on Mumbai Testnet Network; in order to run tests using local Hardhat Test Network use
```shell
$ npx hardhat test ./test/guessGameTest.js --network hardhat
```
add `--verbose` flag if you need more output on console
```shell
$ npx hardhat --verbose test ./test/guessGameTest.js --network hardhat
```

---

## DonationPot contract (FS4V proof of concept)

---

## Boilerplate docs
### Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
