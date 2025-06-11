import { motion } from 'framer-motion';

interface MenuScreenProps {
    isWalletConnected: boolean;
    onStartGame: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ isWalletConnected, onStartGame }) => {
    return (
        <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-6"
        >
            <div className="space-y-4">
                <div className="text-6xl">🏰</div>
                <h2 className="text-2xl font-bold text-white">Welcome, Adventurer!</h2>
                <p className="text-purple-200">
                    Embark on an epic quest through the Web3 realm. Answer mystical questions to collect crystals and level up!
                </p>
            </div>

            {isWalletConnected && (
                <motion.button
                    onClick={onStartGame}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    🚀 Begin Quest
                </motion.button>
            )}
        </motion.div>
    );
};
