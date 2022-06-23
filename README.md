# s4v smart contract proof of concept

a proof of concept for s4v platform funding smart contract process on ETH polygon network

---

## Guess Game tutorial contract


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

### get test credits for Mumbai Testnet
go to [polygon's](https://faucet.polygon.technology) or [mumbai's](https://mumbaifaucet.com) faucets and input your wallet so that you can ask for MATIC credits for Mumbai Testnet

---

### compile & deploy contract on Mumbai Testnet
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

### check contract has been deployed
go to [Polygon Testnet Explorer](https://mumbai.polygonscan.com) and input contract's address on search bar; it should take you to our deployed contract detail view. 

check transaction corresponding to contract creation; in this example it doesn't cost a specific amount of MATIC but what had to be paid as transaction fees.

in this case, for our test, paid fee was `0.001163597789 MATIC` coins, equivalent to `$0.001`.
now check your own wallet and you should see the same transaction and your updated MATIC balance.

---

### add tasks to interact with contract
on this hardhat.config.js file add a task declaration to create a new task, i.e.: `guess`, to interact with out contract through a public method, just like `takeGuess`.

this task will be listed by hardhat on help `$ npx hardhat --help` and may be used through
```shell
# npx hardhat <taskName> <--params values>
$ npx hardhat guess --number 15
```

---

### add unit tests
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

### declare tests for contract

declared tests are based on user stories:
- as **s4v** I want to **create a DonationPot** based on a set of available choices `(humanitarian projects)` and a goal amount `(based on choices budgets)` ✅
- as a **potential donor** I want to **add money to the pot** in order to become a donor and have a vote on this DonationPot ✅
- as a **donor** I should be able to **add more money to the pot** in order to increase my stake in this DonationPot ✅
- as **stakeholder** I want to **check current DonationPot composition** in order to know how much money has each donor put in (🎭 this means we can get donated funds for a specific address, thus requiring being able to get such list of addresses beforehand) ✅
- as **donor** I want to **vote for a choice once goal amount was reached** in order to promote my favorite project ✅
- as **donor** I will only be allowed to **vote during the next fifteen (15) days from the moment the goal amount was reached**, so that funds will not sit idle for long and instead get transfered to winning choice's address ✅
- as **stakeholder** I want to **check voting results** in order to know which choice was selected as beneficiary ✅
- as **winning ngo** I want to **receive funds on my wallet** right after voting window has ended ✅

> pending: determine rules to declare winner on no votes when deadline, or same amount of votes after window closes.

---
### deploy and test drive!

deploy contract on Mumbai Testnet, create test wallets for users and projects, get credits from faucet and run an iteration for a donation pot to see how the contract behaves.

**donors**
```yml
luis: 0x...
karim: 0x...
alfredo: 0x...
steve: 0x...
```

**ngo projects**
```yaml
1:
- name: Chamartín sin fronteras
- address: 0x...
2:
- name: balones unidos
- address: 0x...
3:
- name: hospitales de la cruz
- address: 0x...
```

**getting credits for our donors**
