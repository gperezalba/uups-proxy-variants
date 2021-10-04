// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyTokenV2 is Initializable, ERC20Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address proxyOwner) initializer public {
        __ERC20_init("MyToken", "MTK");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _mint(proxyOwner, 10000 * 10 ** decimals());
        _setupRole(DEFAULT_ADMIN_ROLE, proxyOwner);
        _setupRole(MINTER_ROLE, proxyOwner);
        _setupRole(UPGRADER_ROLE, proxyOwner);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    function version() public pure returns(string memory) {
        return "v2";
    }
}
