import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface MenuScreenProps {
    isWalletConnected: boolean;
    onStartGame: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ isWalletConnected, onStartGame }) => {
    const [showInstructions, setShowInstructions] = useState(false);

    return (
        <>
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

                <div className="space-y-4">
                    <motion.button
                        onClick={() => setShowInstructions(true)}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg border border-purple-400/30"
                        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(168, 85, 247, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        ⚡ Game Instructions
                    </motion.button>

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
                </div>
            </motion.div>

            <AnimatePresence>
                {showInstructions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center  p-4 z-50"
                        onClick={() => setShowInstructions(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-lg rounded-2xl px-4 py-4 max-w-sm w-full h-full  flex flex-col border border-purple-400/30 shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-4 flex-shrink-0">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="text-3xl mb-2"
                                >
                                    🌌
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-2">Galactic Quest Rules</h3>
                                <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
                            </div>

                            <motion.div
                                className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="space-y-4 text-purple-100 pb-4">
                                    <div className="flex items-start space-x-3 p-3 bg-purple-800/30 rounded-lg border border-purple-400/20">
                                        <span className="text-xl">🎯</span>
                                        <div>
                                            <p className="font-semibold text-purple-200">Mission Structure</p>
                                            <p className="text-sm">Navigate through 15 levels, each containing 12 challenging questions</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 bg-red-800/30 rounded-lg border border-red-400/20">
                                        <span className="text-xl">❤️</span>
                                        <div>
                                            <p className="font-semibold text-red-200">Health System</p>
                                            <p className="text-sm">Your health fluctuates based on performance - wrong answers cost 20% health</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 bg-green-800/30 rounded-lg border border-green-400/20">
                                        <span className="text-xl">⚡</span>
                                        <div>
                                            <p className="font-semibold text-green-200">Power Boost</p>
                                            <p className="text-sm">Answer 10 consecutive questions correctly to gain 5% health</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 bg-yellow-800/30 rounded-lg border border-yellow-400/20">
                                        <span className="text-xl">💀</span>
                                        <div>
                                            <p className="font-semibold text-yellow-200">Game Over</p>
                                            <p className="text-sm">When health reaches 0, your galactic journey ends</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 bg-indigo-800/30 rounded-lg border border-indigo-400/20">
                                        <span className="text-xl">🌟</span>
                                        <div>
                                            <p className="font-semibold text-indigo-200">Ultimate Goal</p>
                                            <p className="text-sm">Reach the ends of the galaxy and become a cosmic legend!</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="mt-4 text-center flex-shrink-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <p className="text-purple-300 font-semibold mb-3 text-sm">✨ Good luck, Space Warrior! ✨</p>
                                <motion.button
                                    onClick={() => setShowInstructions(false)}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Ready to Quest! 🚀
                                </motion.button>

                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #8b5cf6 rgba(139, 92, 246, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #8b5cf6, #ec4899);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #7c3aed, #db2777);
                }
            `}</style>
        </>
    );
};