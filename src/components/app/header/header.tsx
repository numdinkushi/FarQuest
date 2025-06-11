import React from 'react';
import { motion } from 'framer-motion';
import { ThreeJSBackground } from '~/components/animation/animated-background';

interface GameHeaderProps {
    gameState: "menu" | "playing" | "complete" | "rewards";
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
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
            </div>
        </div>
    );
};
