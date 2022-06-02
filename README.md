# s4v smart contract proof of concept

a proof of concept for s4v platform funding smart contract process on ETH polygon network


## steps to replicate
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

## Boilerplate docs
### Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

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
