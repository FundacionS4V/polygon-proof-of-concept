// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DonationPot {
    // contracts goal amount; when reached vote starts
    uint256 immutable public goal;
    address[] donorAddresses;
    uint256 public voteStartsAt = 0;
    // a donor with governance over pot funds
    // if election is public, donor struct should
    // include a uint32 vote to store voted choice apiId
    // if election is private, omit such field
    struct Donor {
        uint256 funds;
        bool voted;
        bool registered;
    }
    // a humanitarian project looking for funds
    struct Project {
        address payable account;
        string name;
        uint256 votes;
    }
    // donor structs
    mapping(address => Donor) public donors;
    // project structs: apiId to Project
    mapping(uint32 => Project) public choices;
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
            choices[_apiIds[index]] = Project(
                _accounts[index],
                _names[index],
                0
            );
        }
    }
    receive() external payable {
        require(msg.value > 0, "can't donate 0 tokens");
        require(voteStartsAt == 0, "goal has already been reached, thanks.");
        if (donors[msg.sender].registered) {
            // if msg.sender is already a donor
            // just add to current funds
            donors[msg.sender].funds += msg.value;
        } else {
            // otherwise add it as a donor
            donorAddresses.push(msg.sender);
            donors[msg.sender].funds = msg.value;
            donors[msg.sender].voted = false;
            donors[msg.sender].registered = true;
        }
        if (address(this).balance >= goal) {
            voteStartsAt = block.timestamp;
        }
    }
    function getDonationsFrom(address _donorAddress) 
        external 
        view 
        returns(uint256 _donation) {
        require(donors[_donorAddress].registered, "no such donor.");
        return donors[_donorAddress].funds;
    }
    function getDonors()
        external
        view
        returns(address[] memory) {
        return donorAddresses;
    }
    function vote(uint32 _apiId) external {
        require(address(this).balance >= goal, "pot goal has not been reached; no voting allowed yet.");
        require(block.timestamp < voteStartsAt + 15 days, "sorry, voting window is closed.");
        require(donors[msg.sender].registered, "no such donor.");
        require(donors[msg.sender].voted == false, "donor has already voted.");
        choices[_apiId].votes += donors[msg.sender].funds;
        donors[msg.sender].funds = 0;
        donors[msg.sender].voted = true;
        // donors[msg.sender].vote = _apiId;
    }
}
