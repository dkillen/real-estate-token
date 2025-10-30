// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import {Whitelist} from "../src/Whitelist.sol";

contract WhitelistTest is Test {
    Whitelist wl;

    address INVESTOR_A = vm.addr(1);
    address INVESTOR_B = vm.addr(2);

    address PROJECT_A = address(0xA1);
    address PROJECT_B = address(0xB2);

    event Approved(address indexed project, address indexed investor);
    event Revoked(address indexed project, address indexed investor);

    function setUp() public {
        wl = new Whitelist();
    }

    function test_defaultFalse() public view {
        assertFalse(wl.isApproved(PROJECT_A, INVESTOR_A));
        assertFalse(wl.isApproved(PROJECT_A, INVESTOR_B));
    }

    function test_approve() public {
        vm.expectEmit(true, true, false, false);
        emit Approved(PROJECT_A, INVESTOR_A);
        wl.approve(PROJECT_A, INVESTOR_A);
        assertTrue(wl.isApproved(PROJECT_A, INVESTOR_A));
    }

    function test_revoke() public {
        wl.approve(PROJECT_A, INVESTOR_A);
        vm.expectEmit(true, true, false, false);
        emit Revoked(PROJECT_A, INVESTOR_A);
        wl.revoke(PROJECT_A, INVESTOR_A);
        assertFalse(wl.isApproved(PROJECT_A, INVESTOR_A));
    }
}
