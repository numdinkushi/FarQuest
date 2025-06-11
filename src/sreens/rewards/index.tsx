import { motion } from 'framer-motion';

export const RewardsScreen: React.FC = () => {
    return (
        <motion.div
            key="rewards"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-6"
        >
            <div className="space-y-4">
                <motion.div
                    className="text-6xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    ⚡
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Minting Rewards...</h2>
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-4">
                    <motion.div
                        className="w-full bg-yellow-900/50 rounded-full h-3 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2 }}
                        />
                    </motion.div>
                    <p className="text-yellow-400">Processing blockchain transaction...</p>
                </div>
            </div>
        </motion.div>
    );
};