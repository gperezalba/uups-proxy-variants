// test/MyToken.test.js
const { expect } = require("chai");
const { ethers, upgrades } = require('hardhat');

describe('MyToken', function () {
    it('deploys and upgrades', async function () {
        const [sender] = await ethers.getSigners();
        const MyTokenV1 = await ethers.getContractFactory('MyTokenV1');
        const MyTokenV2 = await ethers.getContractFactory('MyTokenV2');

        let proxy = await upgrades.deployProxy(MyTokenV1, [sender.address], { kind: 'uups' });

        let contract = await MyTokenV1.attach(proxy.address);
        let version =  await contract.version();

        expect(version).to.equal("v1");

        await upgrades.upgradeProxy(proxy.address, MyTokenV2);

    });
});