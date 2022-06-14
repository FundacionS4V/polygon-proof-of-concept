//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GuessGame {
    uint randomNumber;
    bool gameComplete;
    address winner;
    struct player {
        uint guess;
        uint attempts;
        bool registered;
    }
    mapping (address => player) playerStructs;
    address[] internal playerAddresses;

    constructor() {
        randomNumber = 1 + uint(keccak256(abi.encodePacked(block.timestamp))) % 100;
        gameComplete = false;
    }

    function signPlayerUp() internal {
        playerStructs[msg.sender].guess = 0;
        playerStructs[msg.sender].attempts = 5;
        playerStructs[msg.sender].registered = true;
        playerAddresses.push(msg.sender);
    }

    function getPlayer(address _player) internal view returns(bool) {
        return playerStructs[_player].registered;
    }

    function revealNumber() public view returns (uint) {
        return randomNumber;
    }

    function takeGuess(uint _guess) public returns(string memory answer) {
        if (gameComplete) {
            console.log("game is over, winner is:", winner);
            return "game is over";
        }
        if (!getPlayer(msg.sender)) {
            signPlayerUp();
        }
        playerStructs[msg.sender].guess = _guess;
        return updateGame();
    }

    function updateGame() internal returns(string memory answer) {
        uint guess = playerStructs[msg.sender].guess;
        uint attempts = playerStructs[msg.sender].attempts;

        if (attempts == 0) {
            console.log("no more attempts left");
            return "no more attempts left";
        }
        playerStructs[msg.sender].attempts = attempts - 1;
        if (guess > randomNumber) {
            console.log("guess too big, guess again");
            return "guess too big, guess again";
        }
        if (guess < randomNumber) {
            console.log("guess too small, guess again");
            return "guess too small, guess again";
        }
        if (guess == randomNumber) {
            winner = msg.sender;
            gameComplete = true;
            console.log("congrats! you won!");
            return "congrats! you won!";
        }
    }
}
