import React from 'react';
import { motion } from 'framer-motion';
import { Question, Difficulty } from '~/types';

interface FeedbackProps {
    isCorrect: boolean;
    isTimeUp: boolean;
    isBonus: boolean;
    levelCompleted: boolean;
    currentDifficulty: Difficulty;
    reward: Question['reward'];
    isError?: boolean;
    errorMessage?: string;
}

// Simple confetti effect using CSS animations
const ConfettiParticle: React.FC<{ delay: number; duration: number; left: string; }> = ({
    delay,
    duration,
    left
}) => (
    <motion.div
        className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
        style={{
            left,
            top: '-10px',
        }}
        animate={{
            y: [0, 300],
            rotate: [0, 360],
            opacity: [1, 0],
        }}
        transition={{
            duration,
            delay,
            ease: "easeOut"
        }}
    />
);

const Confetti: React.FC = () => {
    const particles = Array.from({ length: 20 }, (_, i) => (
        <ConfettiParticle
            key={i}
            delay={i * 0.1}
            duration={2 + Math.random()}
            left={`${Math.random() * 100}%`}
        />
    ));

    return <div className="absolute inset-0 pointer-events-none overflow-hidden">{particles}</div>;
};

export const Feedback: React.FC<FeedbackProps> = ({
    isCorrect,
    isTimeUp,
    isBonus,
    levelCompleted,
    currentDifficulty,
    reward,
    isError = false,
    errorMessage = ''
}) => {
    const getFeedbackStyle = () => {
        if (isError) {
            return 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-600/60 text-red-300';
        } else if (levelCompleted) {
            return 'bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-yellow-600/20 border-purple-500/50 text-purple-300';
        } else if (isCorrect) {
            return isBonus
                ? 'bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/50 text-green-400'
                : 'bg-green-600/20 border-green-500/50 text-green-400';
        } else if (isTimeUp) {
            return 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400';
        } else {
            return 'bg-red-600/20 border-red-500/50 text-red-400';
        }
    };

    const getFeedbackContent = () => {
        if (isError) {
            return {
                emoji: '⚠️',
                title: 'Something went wrong!',
                subtitle: errorMessage || 'An unexpected error occurred. Please try again.'
            };
        } else if (levelCompleted) {
            return {
                emoji: '🎊',
                title: `${currentDifficulty} Level Complete!`,
                subtitle: 'Advancing to next difficulty level!'
            };
        } else if (isCorrect) {
            const baseSubtitle = `+${reward.exp} XP, +${reward.crystals} Crystals`;
            const bonusSubtitle = isBonus ? '+5% Health' : '';

            return {
                emoji: isBonus ? '🌟' : '🎉',
                title: isBonus ? '10 Streak Bonus! Amazing!' : 'Correct! Well done, adventurer!',
                subtitle: bonusSubtitle ? `${baseSubtitle}, ${bonusSubtitle}` : baseSubtitle
            };
        } else if (isTimeUp) {
            return {
                emoji: '⏰',
                title: "Time's up!",
                subtitle: '-20 Health'
            };
        } else {
            return {
                emoji: '💥',
                title: 'Incorrect! The dragon strikes!',
                subtitle: '-20 Health'
            };
        }
    };

    const content = getFeedbackContent();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative p-4 rounded-xl border ${getFeedbackStyle()}`}
        >
            {levelCompleted && <Confetti />}

            <div className="text-center relative z-10">
                <div className="text-2xl mb-2">{content.emoji}</div>
                <p className="font-bold">{content.title}</p>
                <p className="text-sm mt-1">{content.subtitle}</p>
                {isBonus && !levelCompleted && !isError && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full inline-block"
                    >
                        ✨ Consecutive Bonus!
                    </motion.div>
                )}
                {levelCompleted && !isError && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2 text-xs bg-purple-500/20 text-purple-300 px-3 py-2 rounded-full inline-block"
                    >
                        🚀 Level Up! Get ready for {currentDifficulty}+
                    </motion.div>
                )}
                {isError && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2 text-xs bg-red-500/20 text-red-300 px-3 py-2 rounded-full inline-block"
                    >
                        🔄 Try Again
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};