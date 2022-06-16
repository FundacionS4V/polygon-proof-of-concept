// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DonationPot {
    // contracts goal amount; when reached vote starts
    uint immutable goal;
    // a humanitarian project looking for funds
    struct Project {
        address payable account;
        string name;
        uint apiId;
    }
    // a donor with governance over pot funds
    struct Donor {
        uint funds;
        uint vote;
    }
    // donor structs
    mapping(address => Donor) donors;
    // project structs
    mapping(address => Project) choices;
    // create contract
    // project choices cannot be received as structs
    // as only internal and private functions may
    // receive this type of variables as a parameter
    constructor(
        uint _goal,
        string[] memory _names,
        uint[] memory _apiIds,
        address payable[] memory _accounts
    ) {
        // validates all lists have the same amount of values
        require(
            _names.length == _apiIds.length && _names.length == _accounts.length,
            "names, apiIds and accounts arrays must be of same size"
        );
        // sets goal state value
        goal= _goal;
        // builds each project with ordered data from lists
        // and adds each one as part of choices structs
        for (uint index = 0; index < _names.length; index++) {
            choices[_accounts[index]] = Project(
                _accounts[index],
                _names[index],
                _apiIds[index]
            );
        }
    }
}
