// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import {RealEstateFactory} from "../src/RealEstateFactory.sol";
import {RealEstateToken} from "../src/RealEstateToken.sol";

interface IWhiteList {
    function isApproved(address, address) external view returns (bool);
}
contract MockWhitelistAlwaysTrue is IWhiteList {
    function isApproved(address, address) external pure returns (bool) {
        return true;
    }
}

contract RealEstateFactoryTest is Test {
    RealEstateFactory factory;
    MockWhitelistAlwaysTrue wl;

    address INVESTOR_A = vm.addr(1); // used as issuer in one test
    address INVESTOR_B = vm.addr(2);

    string NAME = "Project A";
    string SYMBOL = "PJA";
    string PROPERTY_ID = "PJA-001";
    string JURIS = "AU";
    string META_URI = "ipfs://cid-a";

    function setUp() public {
        wl = new MockWhitelistAlwaysTrue();
        factory = new RealEstateFactory(address(wl));
    }

    function test_constructor() public view {
        assertEq(factory.whitelist(), address(wl));
        assertEq(factory.owner(), address(this));
    }

    function test_deployProject() public {
        address tokenAddr = factory.deployProject(
            NAME,
            SYMBOL,
            PROPERTY_ID,
            JURIS,
            META_URI
        );
        assertTrue(tokenAddr != address(0));

        address[] memory all = factory.getAllProjects();
        assertEq(all.length, 1);
        assertEq(all[0], tokenAddr);

        RealEstateToken t = RealEstateToken(tokenAddr);
        assertEq(t.name(), NAME);
        assertEq(t.symbol(), SYMBOL);
        assertEq(t.propertyId(), PROPERTY_ID);
        assertEq(t.jurisdiction(), JURIS);
        assertEq(t.metadataUri(), META_URI);
        assertEq(address(t.whitelist()), address(wl));
        assertEq(t.owner(), address(this));
    }

    function test_multipleDeployers() public {
        vm.prank(INVESTOR_A);
        address a = factory.deployProject("A", "A", "A", "AU", "ipfs://a");
        vm.prank(INVESTOR_B);
        address b = factory.deployProject("B", "B", "B", "AU", "ipfs://b");

        address[] memory all = factory.getAllProjects();
        assertEq(all.length, 2);
        assertEq(RealEstateToken(a).owner(), INVESTOR_A);
        assertEq(RealEstateToken(b).owner(), INVESTOR_B);
    }
}
