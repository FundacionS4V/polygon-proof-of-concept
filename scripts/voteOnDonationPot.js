require('dotenv').config();
const API_URL = process.env.API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/DonationPot.sol/DonationPot.json");
const [donor, vote] = process.argv.slice(2);

const contractAddress = process.env.DONATION_POT_ADDRESS;
const donationPot = new web3.eth.Contract(contract.abi, contractAddress);

async function sendVote(donorAddress, donorKey, _vote) {
    const nonce = await web3.eth.getTransactionCount(donorAddress, 'latest');
    const gasEstimate = await donationPot.methods.vote(_vote).estimateGas({
        from: donorAddress
    });
    const voteTX = {
        from: donorAddress,
        to: contractAddress,
        nonce: nonce,
        gas: gasEstimate,
        data: donationPot.methods.vote(_vote).encodeABI()
    };
    const signPromise = web3.eth.accounts.signTransaction(voteTX, donorKey);
    signPromise
        .then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, 
                (error, txHash) => {
                    if (!error) {
                        console.log(`The hash of your transaction is: ${txHash}, \n Check Alchemy's Mempool to view the status of your transaction!`);
                        return;
                    }
                    console.log("Something went wrong when submitting your transaction:", error);
                });
        })
        .catch((error) => {
            console.log(`Promise failed: ${error}`);
        });
}

async function main() {
    const donorAddress = process.env[`${donor}_ADDRESS`];
    const donorKey = process.env[`${donor}_KEY`];
    await sendVote(donorAddress, donorKey, vote);
};

main();
