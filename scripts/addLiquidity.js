const hre = require("hardhat");
const fs = require("fs");

async function main() {
    // Load deployed addresses
    const addresses = JSON.parse(
        fs.readFileSync("deployed-addresses.json", "utf8")
    );

    // Get signer (your wallet)
    const [signer] = await hre.ethers.getSigners();
    console.log("Using account:", signer.address);

    // Get contract instances
    const DEX = await hre.ethers.getContractFactory("DEX");
    const dex = await DEX.attach(addresses.dex);

    const Token1 = await hre.ethers.getContractFactory("TestToken");
    const token1 = await Token1.attach(addresses.token1);

    const Token2 = await hre.ethers.getContractFactory("TestToken");
    const token2 = await Token2.attach(addresses.token2);

    // Amount of tokens to add (1000 tokens each)
    const amount1 = hre.ethers.utils.parseUnits("1000", 18);
    const amount2 = hre.ethers.utils.parseUnits("1000", 18);

    console.log("Approving DEX to spend tokens...");

    // Approve DEX to spend token1
    const approve1Tx = await token1.approve(dex.address, amount1);
    await approve1Tx.wait();
    console.log("Approved TT1");

    // Approve DEX to spend token2
    const approve2Tx = await token2.approve(dex.address, amount2);
    await approve2Tx.wait();
    console.log("Approved TT2");

    console.log("Adding liquidity...");
    const addLiquidityTx = await dex.addLiquidity(amount1, amount2);
    await addLiquidityTx.wait();
    console.log("Liquidity added successfully!");

    // Check the results
    const reserve1 = await dex.reserve1();
    const reserve2 = await dex.reserve2();
    const liquidity = await dex.balanceOf(signer.address);

    console.log("\nPool Status:");
    console.log("TT1 Reserve:", hre.ethers.utils.formatUnits(reserve1, 18));
    console.log("TT2 Reserve:", hre.ethers.utils.formatUnits(reserve2, 18));
    console.log(
        "Your Liquidity Tokens:",
        hre.ethers.utils.formatUnits(liquidity, 18)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
