import React from 'react';
import { WalletState } from "~/types";
import { motion, AnimatePresence } from 'framer-motion';
import { useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut, AlertCircle, ArrowLeftRight, Home } from 'lucide-react';

interface WalletConnectionProps {
    wallet: WalletState;
    onConnect?: () => void;
    onDisconnect?: () => void;
    isConnectPending?: boolean;
    isSDKLoaded?: boolean;
    showSwitchNetworkBanner?: boolean;
    isCorrectChain?: boolean;
    isSwitchChainPending?: boolean;
    onSwitchChain?: () => void;
    targetChain?: { name: string };
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
    wallet,
    onConnect,
    onDisconnect,
    isConnectPending,
    isSDKLoaded = true,
    showSwitchNetworkBanner = false,
    // isCorrectChain = true,
    isSwitchChainPending = false,
    onSwitchChain,
    targetChain = { name: 'Celo' }
}) => {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    // Show loading state while SDK initializes (for Farcaster environment)
    if (!isSDKLoaded) {
        return (
            <div className="flex items-center justify-center py-8">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    <Home className="w-8 h-8 text-purple-400" />
                </motion.div>
            </div>
        );
    }

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
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30"
            >
                <div className="space-y-3">
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">🔗 Connect Your Wallet</h3>
                        <p className="text-purple-200 text-sm">Choose a wallet to connect and start playing</p>
                    </div>

                    {/* Single Connect Button */}
                    <motion.button
                        onClick={handleConnect}
                        disabled={isConnectPending}
                        className={`w-full py-3 px-6 font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                            isConnectPending
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
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
                        <div className="text-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg mt-4">
                            <p className="text-red-300">No wallet connectors available. Check your Wagmi configuration.</p>
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
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-purple-500/30"
        >
            {/* Network Warning Banner */}
            <AnimatePresence>
                {showSwitchNetworkBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 mb-4 flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-300" />
                            <span className="text-amber-100 font-medium text-sm">Wrong network</span>
                        </div>
                        <button
                            onClick={onSwitchChain}
                            disabled={isSwitchChainPending}
                            className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white text-xs py-1.5 px-3 rounded-full flex items-center gap-1 transition-colors"
                        >
                            {isSwitchChainPending ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-3 h-3 border border-white border-t-transparent rounded-full"
                                />
                            ) : (
                                <ArrowLeftRight className="w-3 h-3" />
                            )}
                            Switch to {targetChain.name}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div className="text-sm">
                    <p className="text-purple-200">Connected:</p>
                    <p className="text-purple-300 font-mono text-xs">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </p>
                </div>
                <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm transition-colors backdrop-blur-sm"
                    aria-label="Disconnect wallet"
                >
                    <LogOut className="w-3 h-3" />
                    Disconnect
                </button>
            </div>
        </motion.div>
    );
};