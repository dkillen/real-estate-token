//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {RealEstateToken} from "./RealEstateToken.sol";
import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

// A factory contract to deploy new RealEstateToken contracts
// Factory deploys RealEstateToken contracts representing tokenisation of a real estate assets
// WARNING: This contract is an example only - do not use in production
contract RealEstateFactory is Ownable2Step {
    // Address of the deployed Whitelist contract
    address public whitelist;
    // Array of all RealEstateToken contract addresses
    address[] public allProjects;

    // Event emitted when a new RealEstateToken contract is deployed
    event ProjectCreated(
        address indexed projectAddress,
        address indexed issuer,
        string projectName,
        string projectSymbol,
        string propertyId,
        string jurisdiction,
        string metadataUri
    );

    constructor(address whiteListAddress) Ownable(msg.sender) {
        whitelist = whiteListAddress;
    }

    // Factory function to deploy a new RealEstateToken contract
    /// Returns the address of the deployed RealEstateToken contract
    function deployProject(
        string memory name,
        string memory symbol,
        string memory propertyId,
        string memory jurisdiction,
        string memory metadataUri
    ) external returns (address) {
        RealEstateToken token = new RealEstateToken(
            name,
            symbol,
            whitelist,
            propertyId,
            jurisdiction,
            metadataUri,
            msg.sender
        );

        allProjects.push(address(token));

        emit ProjectCreated(
            address(token),
            msg.sender,
            name,
            symbol,
            propertyId,
            jurisdiction,
            metadataUri
        );

        return address(token);
    }

    // Get an array of all deployed RealEstateToken contracts
    function getAllProjects() external view returns (address[] memory) {
        return allProjects;
    }
}
