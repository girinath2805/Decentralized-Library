import { ethers } from "ethers"
import '@/types'

const network: "testnet" | "previewnet" | "mainnet" = "testnet";


async function walletConnectFcn(): Promise<[string, ethers.BrowserProvider, string] | null> {
    console.log(`\n=======================================`);

    // Ensure window.ethereum is available
    if (!window.ethereum) {
        console.error("- MetaMask or compatible wallet not detected ❌");
        return null;
    }

    // ETHERS PROVIDER
    let provider = new ethers.BrowserProvider(window.ethereum);

    // SWITCH TO HEDERA TEST NETWORK
    console.log(`- Switching network to the Hedera ${network}...🟠`);

    const chainIdMap: Record<string, string> = {
        testnet: "0x128",
        previewnet: "0x129",
        mainnet: "0x127"
    };

    const chainId: string = chainIdMap[network] || "0x128"; // Default to testnet if network is invalid

    try {
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

        if (currentChainId === chainId) {
            console.log(`- Already connected to Hedera ${network} ✅`);
        } else {
            console.log(`- Switching network to Hedera ${network}...🟠`);
            try {
                // Try switching to Hedera
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: chainId }],
                });
                console.log("- Switched ✅");
                provider = new ethers.BrowserProvider(window.ethereum);
            } catch (switchError: any) {
                // If the error is because the network is not added, add and then switch
                if (switchError.code === 4902) {
                    console.log("- Hedera not found in MetaMask, adding it...🟠");

                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainName: `Hedera ${network}`,
                                chainId: chainId,
                                rpcUrls: [`https://${network}.hashio.io/api`],
                                blockExplorerUrls: [`https://hashscan.io/${network}/`],
                            },
                        ],
                    });

                    console.log("- Network added ✅, switching now...");

                    await window.ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: chainId }],
                    });

                    console.log("- Switched ✅");
                    provider = new ethers.BrowserProvider(window.ethereum);
                } else {
                    console.error(`- Failed to switch network: ${switchError.message}`);
                    return null;
                }
            }
        }
    } catch (error) {
        console.error(`- Error checking network: ${(error as Error).message}`);
        return null;
    }

    // CONNECT TO ACCOUNT
    console.log("- Connecting wallet...🟠");
    let selectedAccount: string;

    try {
        const accounts: string[] = await provider.send("eth_requestAccounts", []);
        selectedAccount = accounts[0];
        console.log(`- Selected account: ${selectedAccount} ✅`);
    } catch (connectError) {
        console.error(`- Wallet connection failed: ${(connectError as Error).message}`);
        return null;
    }
    
    return [selectedAccount, provider, network];
}

export default walletConnectFcn;