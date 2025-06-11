import { WalletState } from "~/types";
import { motion } from 'framer-motion';


interface WalletConnectionProps {
    wallet: WalletState;
    onConnect: () => void;
    onDisconnect: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ wallet, onConnect, onDisconnect }) => {
    if (!wallet.isConnected) {
        return (
            <motion.button
                onClick={onConnect}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                🔗 Connect Wallet to Enter
            </motion.button>
        );
    }

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm">
                <p className="text-purple-300">Connected:</p>
                <p className="text-white font-mono text-xs">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </p>
            </div>
            <button
                onClick={onDisconnect}
                className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors"
            >
                Disconnect
            </button>
        </div>
    );
};
