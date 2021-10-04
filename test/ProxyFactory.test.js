// test/ProxyFactoryV1.test.js
const { expect } = require("chai");
const { ethers } = require('hardhat');

describe('ProxyFactoryV1', function () {
    it('deploys and upgrades with Factory', async function () {
        const MyTokenV1 = await ethers.getContractFactory('MyTokenV1');
        const MyTokenV2 = await ethers.getContractFactory('MyTokenV2');
        const ProxyFactoryV1 = await ethers.getContractFactory('ProxyFactoryV1');
        let factory = await ProxyFactoryV1.deploy();
        await factory.createProxy();
        let proxyAddress = await factory.lastProxy();

        let token = MyTokenV1.attach(proxyAddress)
        let version = await token.version()

        expect(version).to.equal("v1");

        let implementationV2 = await MyTokenV2.deploy();

        await token.upgradeTo(implementationV2.address)

        version = await token.version()
        expect(version).to.equal("v2");
    });
});