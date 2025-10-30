// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// A simple whitelist for real estate tokenisation projects
// Provides a whitelist of investor accounts for real estate projects (identified by contract address)
// WARNING: This contract is an example only - do not use in production
contract Whitelist is Ownable2Step {
    // Mapping of project => investor => approved?
    mapping(address => mapping(address => bool)) private _approved;

    // Emitted when an investor is approved for a project
    event Approved(address indexed project, address indexed investor);

    // Emitted when an investor approval is revoked
    event Revoked(address indexed project, address indexed investor);

    constructor() Ownable(msg.sender) {}

    // Add an investor's account address to the whitelist for a specified project
    function approve(address project, address investor) external onlyOwner {
        _approved[project][investor] = true;
        emit Approved(project, investor);
    }

    // Remove an investor's account address from the whitelist for a specified project
    function revoke(address project, address investor) external onlyOwner {
        _approved[project][investor] = false;
        emit Revoked(project, investor);
    }

    // Check if an investor's account address is whitelisted for a specified project
    function isApproved(
        address project,
        address investor
    ) external view returns (bool) {
        return _approved[project][investor];
    }
}
