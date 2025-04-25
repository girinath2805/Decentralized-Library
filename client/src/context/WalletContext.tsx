// WalletContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import walletConnectFcn from '@/lib/walletConnect';
import "@/types"

interface WalletContextType {
    account: string | null;
    provider: ethers.BrowserProvider | null;
    network: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [network, setNetwork] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    // Check if user was previously connected
    useEffect(() => {
        const checkConnection = async () => {
            const savedAccount = localStorage.getItem('walletAccount');
            if (savedAccount) {
                setIsConnecting(true);
                try {
                    const result = await walletConnectFcn();
                    if (result) {
                        const [connectedAccount, connectedProvider, connectedNetwork] = result;
                        setAccount(connectedAccount);
                        setProvider(connectedProvider);
                        setNetwork(connectedNetwork);
                        setIsConnected(true);
                        // Listen for account changes
                        setupEventListeners(connectedProvider);
                    }
                } catch (error) {
                    console.error("Failed to reconnect wallet:", error);
                    localStorage.removeItem('walletAccount');
                }
                setIsConnecting(false);
            }
        };

        checkConnection();

        return () => {
            removeEventListeners()
        }

    }, []);

    const setupEventListeners = (provider: ethers.BrowserProvider) => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());
            window.ethereum.on('disconnect', handleDisconnect);
        }
    };

    const removeEventListeners = () => {
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', () => window.location.reload());
            window.ethereum.removeListener('disconnect', handleDisconnect);
        }
    };

    const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
            // User disconnected their wallet
            handleDisconnect();
        } else {
            // User switched accounts
            setAccount(accounts[0]);
            localStorage.setItem('walletAccount', accounts[0]);
        }
    };

    const handleDisconnect = () => {
        removeEventListeners()
        setAccount(null);
        setProvider(null);
        setNetwork(null);
        setIsConnected(false);
        localStorage.removeItem('walletAccount');
    };

    const connect = async () => {
        setIsConnecting(true);
        try {
            const result = await walletConnectFcn();
            if (result) {
                const [connectedAccount, connectedProvider, connectedNetwork] = result;
                setAccount(connectedAccount);
                setProvider(connectedProvider);
                setNetwork(connectedNetwork);
                setIsConnected(true);
                localStorage.setItem('walletAccount', connectedAccount);
                setupEventListeners(connectedProvider);
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        }
        setIsConnecting(false);
    };

    const disconnect = () => {
        handleDisconnect();
    };

    return (
        <WalletContext.Provider
            value={{
                account,
                provider,
                network,
                isConnected,
                isConnecting,
                connect,
                disconnect
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};