// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import {RealEstateToken} from "../src/RealEstateToken.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IWhiteList {
    function isApproved(
        address project,
        address investor
    ) external view returns (bool);
}
contract MockWhitelist is IWhiteList {
    mapping(address => mapping(address => bool)) public approved;
    function set(address project, address investor, bool ok) external {
        approved[project][investor] = ok;
    }
    function isApproved(
        address project,
        address investor
    ) external view returns (bool) {
        return approved[project][investor];
    }
}

contract RealEstateTokenTest is Test {
    MockWhitelist wl;
    RealEstateToken token;

    address INVESTOR_A = vm.addr(1);
    address INVESTOR_B = vm.addr(2);

    string NAME = "Project A";
    string SYMBOL = "PJA";
    string PROPERTY_ID = "PJA-001";
    string JURIS = "AU";
    string META_URI = "ipfs://cid-a";

    function setUp() public {
        wl = new MockWhitelist();
        token = new RealEstateToken(
            NAME,
            SYMBOL,
            address(wl),
            PROPERTY_ID,
            JURIS,
            META_URI,
            address(this) // project owner
        );
    }

    function test_metadata() public view {
        assertEq(token.name(), NAME);
        assertEq(token.symbol(), SYMBOL);
        assertEq(token.propertyId(), PROPERTY_ID);
        assertEq(token.jurisdiction(), JURIS);
        assertEq(token.metadataUri(), META_URI);
        assertEq(token.decimals(), 0);
        assertEq(token.MAX_SUPPLY(), 100);
        assertEq(address(token.whitelist()), address(wl));
        assertEq(token.owner(), address(this));
    }

    function test_mintWhenApproved() public {
        wl.set(address(token), INVESTOR_A, true);
        token.mint(INVESTOR_A, 10);
        assertEq(token.totalSupply(), 10);
        assertEq(token.balanceOf(INVESTOR_A), 10);
        assertTrue(token.isShareholder(INVESTOR_A));
    }

    function test_mintWhenNotApprovedReverts() public {
        vm.expectRevert(bytes("Investor not approved for this project."));
        token.mint(INVESTOR_A, 1);
    }

    function test_transferRequiresWhitelist() public {
        wl.set(address(token), INVESTOR_A, true);
        wl.set(address(token), INVESTOR_B, true);

        token.mint(INVESTOR_A, 5);

        vm.prank(INVESTOR_A);
        token.transfer(INVESTOR_B, 3);

        assertEq(token.balanceOf(INVESTOR_A), 2);
        assertEq(token.balanceOf(INVESTOR_B), 3);
        assertTrue(token.isShareholder(INVESTOR_B));
    }

    function test_transferToUnapprovedReverts() public {
        wl.set(address(token), INVESTOR_A, true);
        token.mint(INVESTOR_A, 1);

        // INVESTOR_B not approved
        vm.prank(INVESTOR_A);
        vm.expectRevert(bytes("Recipient is not approved for this project"));
        token.transfer(INVESTOR_B, 1);
    }

    function test_adminBurnOnlyOwner() public {
        wl.set(address(token), INVESTOR_A, true);
        token.mint(INVESTOR_A, 4);

        // non-owner cannot call adminBurn
        vm.prank(INVESTOR_A);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                INVESTOR_A
            )
        );
        token.adminBurn(INVESTOR_A, 1);

        // owner can burn
        token.adminBurn(INVESTOR_A, 2);
        assertEq(token.totalSupply(), 2);
        assertEq(token.balanceOf(INVESTOR_A), 2);
    }
}
