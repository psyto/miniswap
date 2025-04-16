const hre = require("hardhat");

async function main() {
    // Deploy first token
    const Token1 = await hre.ethers.getContractFactory("TestToken");
    const token1 = await Token1.deploy("Test Token 1", "TT1");
    await token1.deployed();
    console.log("Token 1 deployed to:", token1.address);

    // Deploy second token
    const Token2 = await hre.ethers.getContractFactory("TestToken");
    const token2 = await Token2.deploy("Test Token 2", "TT2");
    await token2.deployed();
    console.log("Token 2 deployed to:", token2.address);

    // Save the addresses to a file for later use
    const fs = require("fs");
    const addresses = {
        token1: token1.address,
        token2: token2.address,
    };
    fs.writeFileSync(
        "token-addresses.json",
        JSON.stringify(addresses, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
