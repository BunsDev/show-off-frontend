// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Showoff {
     // Mapping from wallet address to an array of strings
    mapping(address => string[]) private data;

    // Event to emit when data is added
    event DataAdded(address indexed wallet, string value);

    // Function to add data to the caller's array
    function addData(string memory value) public {
        data[msg.sender].push(value);
        emit DataAdded(msg.sender, value);
    }

    // Function to get the data of the caller's array
    function getData() public view returns (string[] memory) {
        return data[msg.sender];
    }

    // Function to get the data of a specific address
    function getDataOf(address wallet) public view returns (string[] memory) {
        return data[wallet];
    }
}
