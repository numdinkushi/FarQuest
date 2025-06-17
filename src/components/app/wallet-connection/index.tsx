
import React from 'react';
import { WalletState } from "~/types";
import { motion } from 'framer-motion';
import { useConnect, useConnectors } from 'wagmi';

interface WalletConnectionProps {
    wallet: WalletState;
    onConnect: (connector?: any) => void;
    onDisconnect: () => void;
    isConnectPending?: boolean;
}

const WalletOptions: React.FC<{ onConnect: (connector: any) => void; isConnectPending?: boolean; }> = ({
    onConnect,
    isConnectPending
}) => {
    const { connect, isPending, error } = useConnect();
    const connectors = useConnectors();

    console.log('Available connectors:', connectors);
    console.log('Connect pending:', isPending);
    console.log('Connect error:', error);

    const handleConnect = async (connector: any) => {
        console.log('Attempting to connect with:', connector.name, connector.id);

        try {
            // Direct wagmi connect call
            await connect({ connector });
            console.log('Connection successful');
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    if (connectors.length === 0) {
        return (
            <div className="text-center p-4 bg-red-100 rounded-lg">
                <p className="text-red-600">No wallet connectors available. Check your Wagmi configuration.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">🔗 Connect Your Wallet</h3>
                <p className="text-gray-600 text-sm">Choose a wallet to connect and start playing</p>
                {error && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-red-600 text-sm">
                        Error: {error.message}
                    </div>
                )}
            </div>

            {connectors.map((connector) => {
                const isUnavailable = !connector.ready && connector.id !== 'injected';

                return (
                    <motion.button
                        key={connector.id}
                        onClick={() => handleConnect(connector)}
                        disabled={isPending || isUnavailable}
                        className={`w-full py-3 px-6 font-semibold rounded-lg shadow-lg transition-all duration-200 ${isUnavailable
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl transform hover:scale-105'
                            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileHover={{ scale: (isPending || isUnavailable) ? 1 : 1.02 }}
                        whileTap={{ scale: (isPending || isUnavailable) ? 1 : 0.98 }}
                    >
                        {isPending ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Connecting...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <span className="mr-2">
                                    {connector.id === 'metaMask' && '🦊'}
                                    {connector.id === 'coinbaseWalletSDK' && '🔷'}
                                    {connector.id === 'walletConnect' && '📱'}
                                    {connector.id === 'farcasterFrame' && '🎭'}
                                    {!['metaMask', 'coinbaseWalletSDK', 'walletConnect', 'farcasterFrame'].includes(connector.id) && '👛'}
                                </span>
                                Connect with {connector.name}
                                {isUnavailable && ' (Not Available)'}
                            </div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

export const WalletConnection: React.FC<WalletConnectionProps> = ({
    wallet,
    onConnect,
    onDisconnect,
    isConnectPending
}) => {
    if (!wallet.isConnected) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6"
            >
                <WalletOptions onConnect={onConnect} isConnectPending={isConnectPending} />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6"
        >
            <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <p className="text-purple-300">Connected:</p>
                        <p className="text-purple-500 font-mono text-xs">
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </p>
                    </div>
                    <button
                        onClick={onDisconnect}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-600/90 transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
           
        </motion.div>
    );
};
