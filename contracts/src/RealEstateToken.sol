//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

// Interface for the Whitelist contract isApproved function
interface IWhiteList {
    function isApproved(
        address project,
        address investor
    ) external view returns (bool);
}

// A modified ERC20 token representing 100 shares in a real estate project
// RealEstateToken represents shares in a real estate project
// WARNING: This contract is an example only - do not use in production
contract RealEstateToken is ERC20, Ownable2Step {
    IWhiteList public whitelist;

    // Issuer's property identifier
    string public propertyId;
    // The legal jurisdiction of the real estate
    string public jurisdiction;
    // IPFS CID to legal documents (unused)
    string public metadataUri;

    // Hard cap: 100 tokens max supply. Each token = 1 whole share of the property.
    uint256 public constant MAX_SUPPLY = 100;

    mapping(address => bool) private _isShareholder;
    address[] private _shareholders;

    // The number of investors that hold tokens in the project
    uint256 public shareholderCount;

    constructor(
        string memory name,
        string memory symbol,
        address whiteListAddress,
        string memory _propertyId,
        string memory _jurisdiction,
        string memory _metadataUri,
        address projectOwner
    ) ERC20(name, symbol) Ownable(projectOwner) {
        whitelist = IWhiteList(whiteListAddress);
        propertyId = _propertyId;
        jurisdiction = _jurisdiction;
        metadataUri = _metadataUri;
    }

    // Check whether an address is an investor in this project
    // Returns true if the address is an investor, otherwise false
    function isShareholder(address account) external view returns (bool) {
        return _isShareholder[account];
    }

    // Get a list of shareholders in this project
    // Returns an array of the investor account addresses for this project
    function getShareholders() external view returns (address[] memory) {
        return _shareholders;
    }

    // Check whether an investor's address is on the whitelist
    // Returns true if the address is whitelisted, otherwise false
    function isApprovedHolder(address investor) external view returns (bool) {
        return whitelist.isApproved(address(this), investor);
    }

    // Mints new tokens to a specified address. There are 100 tokens only. Only the issuer (owner) can mint
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");

        // Investor (to) must be approved
        require(
            whitelist.isApproved(address(this), to),
            "Investor not approved for this project."
        );

        // Enforce hard cap (MAX_SUPPLY = 100 tokens)
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "Maximum shares exceeded."
        );

        _mint(to, amount);
    }

    // Admin burn. This is the only way to reduce supply.
    // Used in emergency/problem circumstances (fraud, regulatory unwind etc)
    function adminBurn(address from, uint256 amount) external onlyOwner {
        require(from != address(0), "Invalid from address.");
        _burn(from, amount);
    }

    // Override decimals to ensure 1 token = 1 whole share. No fractional shares
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    // Override some behaviours of the regular _update function for this specific use case
    // Burn only allowed if msg.sender is contract owner (via adminBurn).
    // Mint and transfer sender and recipients must be whitelisted for THIS project
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override {
        bool isMint = (from == address(0));
        bool isBurn = (to == address(0));

        if (isBurn) {
            require(msg.sender == owner(), "Burn restricted to administrator.");
        }

        // Whitelist enforcement
        // Sender must be approved if it's not mint
        if (!isMint) {
            // from is a real holder in transfer OR burn
            require(
                whitelist.isApproved(address(this), from),
                "Sender not approved for this project"
            );
        }

        // Recipient must be approved if it's not burn
        if (!isBurn) {
            // to is a real holder in transfer OR mint
            require(
                whitelist.isApproved(address(this), to),
                "Recipient is not approved for this project"
            );
        }

        // Snapshot balances before
        uint256 fromBalanceBefore = isMint ? 0 : balanceOf(from);
        uint256 toBalanceBefore = isBurn ? 0 : balanceOf(to);

        // Execute state update
        super._update(from, to, value);

        // Snapshot balances after transfer
        uint256 fromBalanceAfter = isMint ? 0 : balanceOf(from);
        uint256 toBalanceAfter = isBurn ? 0 : balanceOf(to);

        // Shareholder bookkeeping

        // Recipient becomes a shareholder
        if (!isBurn) {
            if (
                toBalanceBefore == 0 &&
                toBalanceAfter > 0 &&
                !_isShareholder[to]
            ) {
                _isShareholder[to] = true;
                _shareholders.push(to);
                shareholderCount += 1;
            }
        }

        // Sender ceases to be a shareholder
        if (!isMint) {
            if (
                fromBalanceBefore > 0 &&
                fromBalanceAfter == 0 &&
                _isShareholder[from]
            ) {
                _isShareholder[from] = false;
                shareholderCount -= 1;
                // We do not prune shareholders for gas saving reasons
            }
        }
    }
}
