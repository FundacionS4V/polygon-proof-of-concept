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
luis: 0x03536c24F106B5352EEf494755D1099F9D6AeBfa
karim: 0xD1c3602c885Ed586330a19Dd7A854587bc700A2a
alfredo: 0x6b85EDabA2CecE675e0b402BB5C699A0FfB038aF
steve: 0x80E8857B426caa56540597e28f862204daC3c21f
```

**ngo projects**
```yaml
1:
- name: chamartin sin fronteras
- address: 0xf7C5477f0C0b29E818233DBcAE49ACE851BB2d0b
2:
- name: balones unidos
- address: 0x24ED45Ab02260A827ec199Ed03ca370E256Ba619
3:
- name: hospitales de lacruz
- address: 0x161BC527bf95938C571C109573988815e70321CA
```

**getting credits for our donors**
```yaml
# @ $0.60/MATIC
luis: 5.00000000 MATIC # ~ $3.00 
karim: 0.20000000 MATIC # ~ $0.12
alfredo: 0.20000000 MATIC # ~ $0.12
steve: 1.00000000 MATIC # ~ $0.60
```

**s4v credits**
```yaml
# @ $0.60/MATIC
s4v: 
    address: 0xb59777550bBAEf262cEa9C42eE7ce477194cc25b
    credits: 0.164065043490616649 MATIC # ~ $0.10
```

**build deploy script**

build deployDonationPot.js to deploy contract on Mumbai Testnet using project's data and a goal of `2 MATIC`.

```js
// @ 1000000000000000000 WEI/MATIC 
// as 1 MATIC equals 1 ETH on Polygon network
const goal = ethers.utils.parseEther("2.0");
const names = [
    "chamartin sin fronteras", 
    "balones unidos",
    "hospitales de la cruz"
];
const apiIds = [1, 2, 3];
const accounts = [
    "0xf7C5477f0C0b29E818233DBcAE49ACE851BB2d0b",
    "0x24ED45Ab02260A827ec199Ed03ca370E256Ba619",
    "0x161BC527bf95938C571C109573988815e70321CA"
];
```

**compile and deploy contract**

using same `hardhat.config.js`:
```shell
$ npx hardhat compile
$ npx hardhat run ./scripts/deployDonationPot.js --network polygon_mumbai
```
deployed contract address expected on output:
```shell
donation pot deployed at 0x646944fB1DA1b45A08Fa603C1A8055822d66767F
```

**cost of deployment**

deploying this contract incurred in a gas fee of `0.0150113582385382 MATIC` deducted from s4v account. 
```yaml
s4v: 
    address: 0xb59777550bBAEf262cEa9C42eE7ce477194cc25b
    credits: 0.149053685252078449 MATIC # ~ $0.09
```

**donations**

transfers made to contract address:
```yaml
contract_address: 0x646944fB1DA1b45A08Fa603C1A8055822d66767F
donors:
    - luis: 
        value: 1.0 MATIC
        hash: 0x82335ec90f6c9d33c885d107b5eeb927db62242f46d06f9e4c7c784c4764956e
        fee: 0.005141959330902296 MATIC
        final_balance: 3.994858040669097704 MATIC
    - karim: 
        value: 0.1 MATIC
        hash: 0x6a9b01dd8bb3f5ca538e461c9b1e91667a0f36d9cbbf9e502596b2d5e43cc4d1
        fee: 0.003464624603523532 MATIC
        final_balance: 0.096535375396476468 MATIC
    - alfredo: 
        # value: used max amount transfer as 0.2 MATIC must include fees...
        value: 0.19711498194316161 MATIC
        hash: 0x3d2d494fa048142aa13965f0aaea308304afdae0be5269a9a4fade6dcab248b6
        fee: 0.001398297722151415 MATIC
        final_balance: 0.001486720334686975 MATIC
    - steve: 
        value: 0.9 MATIC
        hash: 0xc00834a9ca7bf6b7c7d70b563b3ff59df51ac6cdf592e6034c2c5247483eae3e
        fee: 0.003928015 MATIC
        # this user cancelled a transfer with a 0.000655110397494 MATIC fee
        final_balance: 0.095416874602506 MATIC
```
```yaml
donation_pot:
    address: 0x646944fB1DA1b45A08Fa603C1A8055822d66767F
    balance: 2.19711498194316161 MATIC
```

**voting starts!**

* install alchemy web3 library
```shell
    npm i @alch/alchemy-web3
```
* create voting scripts for donors on `./scripts`

* update env variables
```env
# for donation pot test drive
DONATION_POT_ADDRESS=0x646944fB1DA1b45A08Fa603C1A8055822d66767F

# luis
LUIS_ADDRESS=
LUIS_KEY=

# karim
KARIM_ADDRESS=
KARIM_KEY=

# alfredo
ALFREDO_ADDRESS=
ALFREDO_KEY=

# steve
SETEVE_ADDRESS=
STEVE_KEY=
```
* run voting scripts for each donor with:
```shell
$ node ./scripts/voteOnDonationPot.js DONOR_NAME API_ID_VOTE`
```
```yaml
contract_address: 0x646944fB1DA1b45A08Fa603C1A8055822d66767F
donors:
    - luis: 
        vote: 3
        hash: 0xc2c90d6c144211fd225cc607fdd1dd5cf40d8101be923d212a8d1c7e4dcdf0cd
        fee: 0.00015599303885004 MATIC
        final_balance: 3.994702047630247664 MATIC
    - karim: 
        vote: 3
        hash: 0xfbded79ff91425f473b006c1805f1723c8ff1a760b2376f9bd7320ba623812f7
        fee: 0.00009091518191232
        final_balance: 0.096444460214564148 MATIC
    - alfredo: 
        vote: 3 # was supposed to be 1, typo (:
        hash: 0x0eee8564e9770a54d8b50f60125815b19b08280c9203dda2dc1c55810f94b563
        fee: 0.00009067370898696 MATIC
        final_balance: 0.001396046625700015 MATIC
    - steve: 
        vote: 2 
        hash: 0x0ac30b4a3b210637b3692e014c4c2cf7245ecefcff8fcdaffa18d796072085a1
        fee: 0.001270215025096016 MATIC # includes fee for transaction to winner
        # this changes if there is no automatic result after last vote
        # instead s4v could run countVotes() fn not only when vote window closes
        # but also on everyone voted on time scenarios, such that this fee
        # corresponds to s4v account
        final_balance: 0.094146659577409984 MATIC
```

### winning choice

after last vote was emmited, a transaction was sent to hospitales de lacruz account for the whole contract balance.
```yaml
hospitales de lacruz:
    address: 0x161BC527bf95938C571C109573988815e70321CA
    balance: 2.19711498194316161 MATIC
```
full contract balance was sent to winner as internal transaction, such that transaction fee was paid by last voter and current contract balance is 0.

-----

### test drive extrapolation

on ethereum chain transactions and fees will behave just as it happens on polygon mumbais network, so we can figure 1 ETH will behave as 1 MATIC did.
