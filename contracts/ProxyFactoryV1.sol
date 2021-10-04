// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./MyTokenV1.sol";

contract ProxyFactoryV1 {
    address immutable implementation;
    address public lastProxy;

    constructor() {
        implementation = address(new MyTokenV1());
    }

    function createProxy() public returns(address) {
        ERC1967Proxy proxy = new ERC1967Proxy(
            implementation,
            abi.encodeWithSelector(MyTokenV1(address(0)).initialize.selector, msg.sender)
        );

        lastProxy = address(proxy);
        
        return address(proxy);
    }
}