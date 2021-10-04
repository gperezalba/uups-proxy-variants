const { ethers } = require('hardhat');

async function main() {
    const [sender] = await ethers.getSigners();
    const MyTokenV1 = await ethers.getContractFactory('MyTokenV1');
    const MyTokenV2 = await ethers.getContractFactory('MyTokenV2');
    const ProxyFactoryV1Beacon = await ethers.getContractFactory('ProxyFactoryV1Beacon');
    const UpgradeableBeacon = await ethers.getContractFactory('UpgradeableBeacon');
    let factory = await ProxyFactoryV1Beacon.deploy(sender.address);

    console.log("Factory deployed at: " + factory.address)

    await factory.createProxy();
    let proxyAddress = await factory.lastProxy();

    console.log("Proxy1 deployed at: " + proxyAddress);
    let token1 = MyTokenV1.attach(proxyAddress)
    let version1 = await token1.version()
    console.log("Version1: " + version1)

    await factory.createProxy();
    let proxyAddress2 = await factory.lastProxy();

    console.log("Proxy2 deployed at: " + proxyAddress2);
    let token2 = MyTokenV1.attach(proxyAddress2)
    let version2 = await token2.version()
    console.log("Version2: " + version2)

    let implementationV2 = await MyTokenV2.deploy();

    console.log("Deployed implementation V2 at: " + implementationV2.address)

    let beacon = UpgradeableBeacon.attach(await factory.getBeacon())
    await beacon.upgradeTo(implementationV2.address)

    console.log("Beacon implementation upgraded")

    version1 = await token1.version()
    console.log("Version1: " + version1)

    version2 = await token2.version()
    console.log("Version2: " + version2)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });