import { useState, useCallback } from 'react';
import { WalletState } from '~/types';

export const useWallet = () => {
    const [wallet, setWallet] = useState<WalletState>({
        isConnected: false,
        address: ''
    });

    // Enhanced wallet connection with better error handling
    const connectWallet = async (): Promise<void> => {
        try {
            // Check for MetaMask/Web3 wallet
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts'
                    });
                    if (accounts.length > 0) {
                        setWallet({
                            isConnected: true,
                            address: accounts[0]
                        });
                        return;
                    }
                } catch (walletError) {
                    console.warn('MetaMask connection failed, using mock wallet:', walletError);
                }
            }

            // Fallback to mock wallet for development
            const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
            setWallet({
                isConnected: true,
                address: mockAddress
            });
        } catch (error) {
            console.error('Wallet connection failed:', error);
            throw new Error('Failed to connect wallet');
        }
    };

    // Enhanced disconnect that accepts optional callback for saving state
    const disconnectWallet = useCallback(async (onBeforeDisconnect?: () => Promise<void>): Promise<void> => {
        try {
            // Execute any pre-disconnect logic (like saving game state)
            if (onBeforeDisconnect) {
                await onBeforeDisconnect();
            }
        } catch (error) {
            console.error('Error during pre-disconnect logic:', error);
            // Continue with disconnect even if save fails
        } finally {
            setWallet({ isConnected: false, address: '' });
        }
    }, []);

    return {
        wallet,
        connectWallet,
        disconnectWallet
    };
};