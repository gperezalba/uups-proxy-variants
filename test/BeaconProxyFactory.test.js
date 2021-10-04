// test/ProxyFactoryV1.test.js
const { expect } = require("chai");
const { ethers } = require('hardhat');

describe('ProxyFactoryV1Beacon', function () {
    it('deploys and upgrades with BeaconFactory', async function () {
        const [sender] = await ethers.getSigners();
        const MyTokenV1 = await ethers.getContractFactory('MyTokenV1');
        const MyTokenV2 = await ethers.getContractFactory('MyTokenV2');
        const ProxyFactoryV1Beacon = await ethers.getContractFactory('ProxyFactoryV1Beacon');
        const UpgradeableBeacon = await ethers.getContractFactory('UpgradeableBeacon');
        let factory = await ProxyFactoryV1Beacon.deploy(sender.address);

        await factory.createProxy();
        let proxyAddress = await factory.lastProxy();

        let token1 = MyTokenV1.attach(proxyAddress)
        let version1 = await token1.version()
        expect(version1).to.equal("v1");

        await factory.createProxy();
        let proxyAddress2 = await factory.lastProxy();

        let token2 = MyTokenV1.attach(proxyAddress2)
        let version2 = await token2.version()
        expect(version2).to.equal("v1");

        let implementationV2 = await MyTokenV2.deploy();

        let beacon = UpgradeableBeacon.attach(await factory.getBeacon())
        await beacon.upgradeTo(implementationV2.address)

        version1 = await token1.version()
        expect(version1).to.equal("v2");

        version2 = await token2.version()
        expect(version2).to.equal("v2");
    });
});