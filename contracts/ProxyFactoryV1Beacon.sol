// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./MyTokenV1.sol";

contract ProxyFactoryV1Beacon {
    address immutable beacon;
    address public lastProxy;

    constructor(address upgrader) {
        UpgradeableBeacon _beacon = new UpgradeableBeacon(address(new MyTokenV1()));
        beacon = address(_beacon);
        _beacon.transferOwnership(upgrader);

    }

    function createProxy() public returns(address) {
        BeaconProxy proxy = new BeaconProxy(
            beacon,
            abi.encodeWithSelector(MyTokenV1(address(0)).initialize.selector, msg.sender)
        );

        lastProxy = address(proxy);
        
        return address(proxy);
    }

    function getBeacon() public view returns(address) {
        return beacon;
    }
}