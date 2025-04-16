"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import {
    getDEXContract,
    getToken1Contract,
    getToken2Contract,
} from "../contracts/DEX";
import { ethers } from "ethers";

export default function DEXInterface() {
    const { provider, account, isConnected } = useWeb3();
    const [amount1, setAmount1] = useState("");
    const [amount2, setAmount2] = useState("");
    const [swapAmount, setSwapAmount] = useState("");
    const [swapDirection, setSwapDirection] = useState<"token1" | "token2">(
        "token1"
    );
    const [loading, setLoading] = useState(false);
    const [approvalLoading, setApprovalLoading] = useState(false);

    // Debug logging
    useEffect(() => {
        console.log("DEXInterface mounted");
        console.log("isConnected:", isConnected);
        console.log("account:", account);
    }, [isConnected, account]);

    const approveTokens = async (
        token: ethers.Contract,
        spender: string,
        amount: ethers.BigNumber
    ) => {
        if (!provider || !account) return false;
        setApprovalLoading(true);
        try {
            const currentAllowance = await token.allowance(account, spender);
            if (currentAllowance.lt(amount)) {
                const tx = await token.approve(spender, amount);
                await tx.wait();
            }
            setApprovalLoading(false);
            return true;
        } catch (error) {
            console.error("Error approving tokens:", error);
            setApprovalLoading(false);
            return false;
        }
    };

    const addLiquidity = async () => {
        if (!provider || !account) return;
        setLoading(true);
        try {
            const dex = getDEXContract(provider);
            const token1 = getToken1Contract(provider);
            const token2 = getToken2Contract(provider);

            const amount1Wei = ethers.utils.parseUnits(amount1, 18);
            const amount2Wei = ethers.utils.parseUnits(amount2, 18);

            const token1Approved = await approveTokens(
                token1,
                dex.address,
                amount1Wei
            );
            const token2Approved = await approveTokens(
                token2,
                dex.address,
                amount2Wei
            );

            if (!token1Approved || !token2Approved) {
                alert("Failed to approve tokens");
                setLoading(false);
                return;
            }

            const tx = await dex.addLiquidity(amount1Wei, amount2Wei);
            await tx.wait();
            alert("Liquidity added successfully!");
        } catch (error) {
            console.error("Error adding liquidity:", error);
            alert("Failed to add liquidity");
        }
        setLoading(false);
    };

    const swapTokens = async () => {
        if (!provider || !account) return;
        setLoading(true);
        try {
            const dex = getDEXContract(provider);
            const token1 = getToken1Contract(provider);
            const token2 = getToken2Contract(provider);

            const swapAmountWei = ethers.utils.parseUnits(swapAmount, 18);

            if (swapDirection === "token1") {
                const approved = await approveTokens(
                    token1,
                    dex.address,
                    swapAmountWei
                );
                if (!approved) {
                    alert("Failed to approve tokens");
                    setLoading(false);
                    return;
                }
                const tx = await dex.swapToken1ForToken2(swapAmountWei);
                await tx.wait();
            } else {
                const approved = await approveTokens(
                    token2,
                    dex.address,
                    swapAmountWei
                );
                if (!approved) {
                    alert("Failed to approve tokens");
                    setLoading(false);
                    return;
                }
                const tx = await dex.swapToken2ForToken1(swapAmountWei);
                await tx.wait();
            }
            alert("Swap completed successfully!");
        } catch (error) {
            console.error("Error swapping tokens:", error);
            alert("Failed to swap tokens");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-800">
                    MiniSwap DEX
                </h1>
            </div>

            {!isConnected ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-600">
                        Please connect your wallet to use the DEX
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-8 p-4 border rounded bg-white shadow">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Add Liquidity
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 text-gray-700">
                                    TT1 Amount
                                </label>
                                <input
                                    type="number"
                                    value={amount1}
                                    onChange={(e) => setAmount1(e.target.value)}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading || approvalLoading}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-gray-700">
                                    TT2 Amount
                                </label>
                                <input
                                    type="number"
                                    value={amount2}
                                    onChange={(e) => setAmount2(e.target.value)}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading || approvalLoading}
                                />
                            </div>
                            <button
                                onClick={addLiquidity}
                                disabled={loading || approvalLoading}
                                className="w-full py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                            >
                                {loading
                                    ? "Adding Liquidity..."
                                    : approvalLoading
                                    ? "Approving Tokens..."
                                    : "Add Liquidity"}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border rounded bg-white shadow">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Swap Tokens
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 text-gray-700">
                                    Swap Direction
                                </label>
                                <select
                                    value={swapDirection}
                                    onChange={(e) =>
                                        setSwapDirection(
                                            e.target.value as
                                                | "token1"
                                                | "token2"
                                        )
                                    }
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading || approvalLoading}
                                >
                                    <option value="token1">TT1 → TT2</option>
                                    <option value="token2">TT2 → TT1</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-gray-700">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={swapAmount}
                                    onChange={(e) =>
                                        setSwapAmount(e.target.value)
                                    }
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading || approvalLoading}
                                />
                            </div>
                            <button
                                onClick={swapTokens}
                                disabled={loading || approvalLoading}
                                className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                            >
                                {loading
                                    ? "Swapping..."
                                    : approvalLoading
                                    ? "Approving Tokens..."
                                    : "Swap Tokens"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
