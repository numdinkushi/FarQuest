import { useState, useCallback, useEffect } from 'react';
import { useAccount, useDisconnect, useConnect, useSwitchChain, useChainId } from 'wagmi';
import { WalletState } from '~/types';
import { celo } from 'viem/chains';

export const useWallet = () => {
    console.log('Initializing useWallet hook...');
    const { address, isConnected, chain } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect, connectors } = useConnect();
    const { switchChain, isPending: isSwitchChainPending } = useSwitchChain();
    const chainId = useChainId();

    // Define target chain
    const CELO_CHAIN_ID = celo.id;
    const targetChain = celo;
    const isCorrectChain = chain?.id === CELO_CHAIN_ID;

    const [wallet, setWallet] = useState<WalletState>({
        isConnected: false,
        address: ''
    });

    // Sync wagmi state with local wallet state
    useEffect(() => {
        console.log('Syncing wallet state:', { isConnected, address });
        setWallet({
            isConnected: isConnected,
            address: address || ''
        });
    }, [isConnected, address]);

    // Simplified wallet connection like Bank of Celo
    const connectWallet = useCallback(async (): Promise<void> => {
        try {
            console.log('connectWallet called');
            console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name, ready: c.ready })));

            // Bank of Celo style connector selection - prefer injected (MetaMask) or fallback
            const connector = connectors.find((c) => c.id === "injected") || connectors[0];

            if (!connector) {
                throw new Error('No wallet connectors available');
            }

            console.log('Using connector:', connector.name);
            
            // Connect with target chain ID like Bank of Celo
            await connect({
                connector,
                chainId: CELO_CHAIN_ID,
            });

        } catch (error) {
            console.error('Wallet connection failed:', error);
            throw new Error(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [connect, connectors, CELO_CHAIN_ID]);

    // Enhanced disconnect that accepts optional callback for saving state
    const disconnectWallet = useCallback(async (onBeforeDisconnect?: () => Promise<void>): Promise<void> => {
        try {
            console.log('Disconnecting wallet...');
            // Execute any pre-disconnect logic (like saving game state)
            if (onBeforeDisconnect) {
                await onBeforeDisconnect();
            }
        } catch (error) {
            console.error('Error during pre-disconnect logic:', error);
            // Continue with disconnect even if save fails
        } finally {
            // Use wagmi's disconnect
            disconnect();
        }
    }, [disconnect]);

    // Chain switching functionality
    const switchToTargetChain = useCallback(async (): Promise<void> => {
        try {
            console.log('Switching to target chain:', targetChain.name);
            await switchChain({ chainId: targetChain.id });
        } catch (error) {
            console.error("Chain switch failed:", error);
            throw new Error(`Failed to switch to ${targetChain.name}. Please try again.`);
        }
    }, [switchChain, targetChain]);

    // Debug connection status
    useEffect(() => {
        console.log('Wallet state changed:', {
            isConnected,
            address,
            chainId: chain?.id,
            chainName: chain?.name,
            connectError: null
        });
    }, [isConnected, address, chain]);

    // Log connector status
    useEffect(() => {
        console.log('Connectors status:', connectors.map(c => ({
            id: c.id,
            name: c.name,
            ready: c.ready,
            type: c.type
        })));
    }, [connectors]);

    return {
        // Existing interface
        wallet,
        connectWallet,
        disconnectWallet,

        // Additional wagmi-powered features
        chain,
        chainId,
        isCorrectChain,
        targetChain,
        switchToTargetChain,
        isSwitchChainPending,
        isConnectPending: false, // Remove this if you have connect pending state

        // Connection utilities
        availableConnectors: connectors,

        // Raw wagmi hooks for advanced usage
        rawWagmiData: {
            address,
            isConnected,
            chain,
            connectors
        }
    };
};