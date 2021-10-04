const { ethers } = require('hardhat');

async function main() {
    const MyTokenV1 = await ethers.getContractFactory('MyTokenV1');
    const MyTokenV2 = await ethers.getContractFactory('MyTokenV2');
    const ProxyFactoryV1 = await ethers.getContractFactory('ProxyFactoryV1');
    let factory = await ProxyFactoryV1.deploy();

    console.log("Factory deployed at: " + factory.address)

    await factory.createProxy();
    let proxyAddress = await factory.lastProxy();

    console.log("Proxy deployed at: " + proxyAddress);
    let token = MyTokenV1.attach(proxyAddress)
    let v1 = await token.version()
    console.log("Version1: " + v1)

    let implementationV2 = await MyTokenV2.deploy();

    console.log("Deployed implementation V2 at: " + implementationV2.address)

    await token.upgradeTo(implementationV2.address)

    let v2 = await token.version()
    console.log("Version2: " + v2)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });