"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (event: string, callback: (accounts: string[]) => void) => void;
            removeListener: (
                event: string,
                callback: (accounts: string[]) => void
            ) => void;
            isMetaMask?: boolean;
        };
    }
}

interface Web3ContextType {
    provider: ethers.providers.Web3Provider | null;
    account: string | null;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
    provider: null,
    account: null,
    isConnected: false,
    connect: async () => {},
    disconnect: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export function Web3ContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [provider, setProvider] =
        useState<ethers.providers.Web3Provider | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Debug logging
    useEffect(() => {
        console.log("Web3Context state:", {
            provider,
            account,
            isConnected,
            isInitialized,
        });
    }, [provider, account, isConnected, isInitialized]);

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") {
            console.log("Running on server side, skipping initialization");
            return;
        }

        console.log("Initializing Web3Context");

        const checkConnection = async () => {
            if (window.ethereum) {
                try {
                    console.log("Checking for existing connection");
                    const accounts = await window.ethereum.request({
                        method: "eth_accounts",
                    });
                    console.log("Found accounts:", accounts);

                    if (accounts.length > 0) {
                        const web3Provider = new ethers.providers.Web3Provider(
                            window.ethereum
                        );
                        setProvider(web3Provider);
                        setAccount(accounts[0]);
                        setIsConnected(true);
                    }
                } catch (error) {
                    console.error("Error checking connection:", error);
                }
            } else {
                console.log("No ethereum provider found");
            }
            setIsInitialized(true);
        };

        checkConnection();

        const handleAccountsChanged = (accounts: string[]) => {
            console.log("Accounts changed:", accounts);
            if (accounts.length === 0) {
                setAccount(null);
                setIsConnected(false);
            } else {
                setAccount(accounts[0]);
                setIsConnected(true);
            }
        };

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener(
                    "accountsChanged",
                    handleAccountsChanged
                );
            }
        };
    }, []);

    const connect = async () => {
        if (typeof window === "undefined") return;

        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        try {
            console.log("Connecting to MetaMask");
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Connected accounts:", accounts);

            const web3Provider = new ethers.providers.Web3Provider(
                window.ethereum
            );
            setProvider(web3Provider);
            setAccount(accounts[0]);
            setIsConnected(true);
        } catch (error) {
            console.error("Error connecting:", error);
            alert("Failed to connect to MetaMask");
        }
    };

    const disconnect = () => {
        console.log("Disconnecting wallet");
        setProvider(null);
        setAccount(null);
        setIsConnected(false);
    };

    // Only render children after initialization
    if (!isInitialized) {
        console.log("Waiting for initialization");
        return null;
    }

    return (
        <Web3Context.Provider
            value={{ provider, account, isConnected, connect, disconnect }}
        >
            {children}
        </Web3Context.Provider>
    );
}
