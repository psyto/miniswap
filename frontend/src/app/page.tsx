"use client";

import { Web3ContextProvider } from "../context/Web3Context";
import DEXInterface from "../components/DEXInterface";
import { useWeb3 } from "../context/Web3Context";

function WalletButton() {
    const { account, isConnected, connect, disconnect } = useWeb3();

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            {isConnected && account ? (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                        {formatAddress(account)}
                    </span>
                    <button
                        onClick={disconnect}
                        className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <button
                    onClick={connect}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
}

export default function Home() {
    return (
        <Web3ContextProvider>
            <WalletButton />
            <main className="min-h-screen bg-gray-50 pt-16">
                <DEXInterface />
            </main>
        </Web3ContextProvider>
    );
}
