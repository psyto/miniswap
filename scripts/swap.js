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

    // Amount to swap (10 tokens)
    const swapAmount = hre.ethers.utils.parseUnits("10", 18);

    // Check initial balances
    const initialTT1Balance = await token1.balanceOf(signer.address);
    const initialTT2Balance = await token2.balanceOf(signer.address);
    console.log("\nInitial Balances:");
    console.log(
        "TT1 Balance:",
        hre.ethers.utils.formatUnits(initialTT1Balance, 18)
    );
    console.log(
        "TT2 Balance:",
        hre.ethers.utils.formatUnits(initialTT2Balance, 18)
    );

    // Check pool reserves before swap
    const initialReserve1 = await dex.reserve1();
    const initialReserve2 = await dex.reserve2();
    console.log("\nPool Reserves Before Swap:");
    console.log(
        "TT1 Reserve:",
        hre.ethers.utils.formatUnits(initialReserve1, 18)
    );
    console.log(
        "TT2 Reserve:",
        hre.ethers.utils.formatUnits(initialReserve2, 18)
    );

    // Approve DEX to spend tokens
    console.log("\nApproving DEX to spend tokens...");
    const approveTx = await token1.approve(dex.address, swapAmount);
    await approveTx.wait();
    console.log("Approved TT1");

    // Perform the swap (TT1 -> TT2)
    console.log("\nSwapping TT1 for TT2...");
    const swapTx = await dex.swapToken1ForToken2(swapAmount);
    await swapTx.wait();
    console.log("Swap completed!");

    // Check final balances
    const finalTT1Balance = await token1.balanceOf(signer.address);
    const finalTT2Balance = await token2.balanceOf(signer.address);
    console.log("\nFinal Balances:");
    console.log(
        "TT1 Balance:",
        hre.ethers.utils.formatUnits(finalTT1Balance, 18)
    );
    console.log(
        "TT2 Balance:",
        hre.ethers.utils.formatUnits(finalTT2Balance, 18)
    );

    // Check pool reserves after swap
    const finalReserve1 = await dex.reserve1();
    const finalReserve2 = await dex.reserve2();
    console.log("\nPool Reserves After Swap:");
    console.log(
        "TT1 Reserve:",
        hre.ethers.utils.formatUnits(finalReserve1, 18)
    );
    console.log(
        "TT2 Reserve:",
        hre.ethers.utils.formatUnits(finalReserve2, 18)
    );

    // Calculate price impact
    const priceBefore = Number(initialReserve2) / Number(initialReserve1);
    const priceAfter = Number(finalReserve2) / Number(finalReserve1);
    console.log("\nPrice Impact:");
    console.log("Price Before Swap:", priceBefore.toFixed(6));
    console.log("Price After Swap:", priceAfter.toFixed(6));
    console.log(
        "Price Change:",
        (((priceAfter - priceBefore) / priceBefore) * 100).toFixed(4) + "%"
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
