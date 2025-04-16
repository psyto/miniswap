const hre = require("hardhat");
const fs = require("fs");

async function main() {
    // Token addresses from our previous deployment
    const token1Address = "0x938432d44F9Ac4Fcee4F26E94e318a347E55507E"; // TT1
    const token2Address = "0x4651e6CaD609D3C6B97EdBa26156FF6D489c630b"; // TT2

    console.log("Deploying DEX with tokens:");
    console.log("Token 1 (TT1):", token1Address);
    console.log("Token 2 (TT2):", token2Address);

    const DEX = await hre.ethers.getContractFactory("DEX");
    const dex = await DEX.deploy(token1Address, token2Address);

    await dex.deployed();

    console.log("DEX deployed to:", dex.address);

    // Save DEX address to a file for later use
    const addresses = {
        token1: token1Address,
        token2: token2Address,
        dex: dex.address,
    };
    fs.writeFileSync(
        "deployed-addresses.json",
        JSON.stringify(addresses, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
