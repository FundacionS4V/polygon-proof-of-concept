// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DonationPot {
    // contracts goal amount; when reached vote starts
    uint256 immutable public goal;
    // a donor with governance over pot funds
    struct Donor {
        uint256 funds;
        bool voted;
        bool registered;
    }
    // a humanitarian project looking for funds
    struct Project {
        address payable account;
        string name;
        uint32 apiId;
        uint16 votes;
    }
    // donor structs
    mapping(address => Donor) public donors;
    // project structs
    mapping(address => Project) public choices;
    // create contract
    // project choices cannot be received as structs
    // as only internal and private functions may
    // receive this type of variables as a parameter
    constructor(
        uint256 _goal,
        string[] memory _names,
        uint32[] memory _apiIds,
        address payable[] memory _accounts
    ) {
        // validates all lists have the same amount of values
        require(
            _names.length == _apiIds.length && _names.length == _accounts.length,
            "names, apiIds and accounts arrays must be of same size"
        );
        // sets goal state value
        goal = _goal;
        // builds each project with ordered data from lists
        // and adds each one as part of choices structs
        for (uint8 index = 0; index < _names.length; index++) {
            choices[_accounts[index]] = Project(
                _accounts[index],
                _names[index],
                _apiIds[index],
                0
            );
        }
    }
    receive() external payable {
        require(msg.value > 0, "can't donate 0 tokens");
        if (donors[msg.sender].registered) {
            donors[msg.sender].funds += msg.value;
        } else {
            donors[msg.sender].funds = msg.value;
            donors[msg.sender].voted = false;
            donors[msg.sender].registered = true;
        }
    }
    function getDonationsBy(address _donorAddress) 
        external 
        view 
        returns(uint256 _donation) {
        require(donors[_donorAddress].registered, "haven't donated anything yet");
        return donors[_donorAddress].funds;
    }
    // function sendTransfer(address payable _to, uint256 _amount) external payable {
    //     _to.transfer(_amount);
    // }
    // function collaborate() public payable returns(uint256 currentDonorFunds) {
    //     require(msg.value > 0, "can't donate 0 tokens");
    //     console.log(msg.value);
    //     if (donors[msg.sender].registered) {
    //         donors[msg.sender].funds += msg.value;
    //     } else {
    //         donors[msg.sender].funds = msg.value;
    //         donors[msg.sender].vote = 0;
    //         donors[msg.sender].registered = true;
    //     }
    //     return donors[msg.sender].funds;
    // }
}
