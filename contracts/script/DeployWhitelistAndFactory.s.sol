// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import {Whitelist} from "../src/Whitelist.sol";
import {RealEstateFactory} from "../src/RealEstateFactory.sol";

contract DeployWhitelistAndFactory is Script {
    function run() external {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPk);

        // 1) Deploy Whitelist (owner = deployer)
        Whitelist wl = new Whitelist();

        // 2) Deploy Factory wired to the Whitelist
        RealEstateFactory factory = new RealEstateFactory(address(wl));

        vm.stopBroadcast();

        console2.log("Whitelist:", address(wl));
        console2.log("Factory  :", address(factory));
    }
}
