const { ethers } = require("hardhat");

async function main() {
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
    const DonationPot = await ethers.getContractFactory(
        "DonationPot"
    );
    const donationPot = await DonationPot.deploy(
        goal,
        names,
        apiIds,
        accounts
    );
    await donationPot.deployed();
    console.log(`donation pot deployed at ${donationPot.address}`);
};

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
