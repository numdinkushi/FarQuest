import React from 'react';
import { WalletState } from "~/types";
import { motion } from 'framer-motion';
import { useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut } from 'lucide-react';

interface WalletConnectionProps {
    wallet: WalletState;
    onConnect?: () => void;
    onDisconnect?: () => void;
    isConnectPending?: boolean;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
    wallet,
    onConnect,
    onDisconnect,
    isConnectPending
}) => {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    // Bank of Celo style connection handler
    const handleConnect = () => {
        // Prefer injected (MetaMask) or fallback to first available
        const connector = connectors.find((c) => c.id === "injected") || connectors[0];
        
        if (connector) {
            connect({
                connector,
                chainId: 42220, // Celo mainnet - adjust as needed
            });
            console.log('Connecting with:', connector.name, connector.id);
        }

        // Call the optional onConnect callback
        if (onConnect) {
            onConnect();
        }
    };

    const handleDisconnect = () => {
        disconnect();
        if (onDisconnect) {
            onDisconnect();
        }
    };

    if (!wallet.isConnected) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
            >
                <div className="space-y-3">
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">🔗 Connect Your Wallet</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Choose a wallet to connect and start playing</p>
                    </div>

                    {/* Single Connect Button */}
                    <motion.button
                        onClick={handleConnect}
                        disabled={isConnectPending}
                        className={`w-full py-3 px-6 font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                            isConnectPending
                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-600 hover:shadow-xl transform hover:scale-105'
                        }`}
                        whileHover={{ scale: isConnectPending ? 1 : 1.02 }}
                        whileTap={{ scale: isConnectPending ? 1 : 0.98 }}
                    >
                        {isConnectPending ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                Connecting...
                            </>
                        ) : (
                            <>
                                <Wallet className="w-4 h-4" />
                                Connect Wallet
                            </>
                        )}
                    </motion.button>

                    {connectors.length === 0 && (
                        <div className="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg mt-4">
                            <p className="text-red-600 dark:text-red-400">No wallet connectors available. Check your Wagmi configuration.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
        >
            <div className="flex items-center justify-between">
                <div className="text-sm">
                    <p className="text-gray-600 dark:text-gray-400">Connected:</p>
                    <p className="text-purple-600 dark:text-purple-400 font-mono text-xs">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </p>
                </div>
                <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                    aria-label="Disconnect wallet"
                >
                    <LogOut className="w-3 h-3" />
                    Disconnect
                </button>
            </div>
        </motion.div>
    );
};