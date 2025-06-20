import React from 'react';
import { motion } from 'framer-motion';
import { ThreeJSBackground } from '~/components/animation/animated-background';

interface GameHeaderProps {
    gameState: "menu" | "playing" | "complete" | "rewards";
    username?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState, username }) => {
    return (
        <div className="relative p-6 bg-gradient-to-r from-purple-600/30 to-blue-600/30">
            <ThreeJSBackground gameState={gameState} />
            <div className="relative z-10">
                <motion.h1
                    className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    ⚔️ FARQUEST ⚔️
                </motion.h1>
                <p className="text-center text-purple-200 mt-2">Web3 Adventure Quiz</p>
                {username && (
                    <motion.div 
                        className="flex justify-center mt-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-sm opacity-75"></div>
                            <div className="relative bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-sm border border-purple-400/50 px-6 py-2 rounded-full shadow-lg">
                                <span className="text-white font-semibold text-lg">
                                    👑 {username}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};