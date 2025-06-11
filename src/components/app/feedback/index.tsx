import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '~/types';

interface FeedbackProps {
    isCorrect: boolean;
    isTimeUp: boolean;
    isBonus: boolean;
    reward: Question['reward'];
}

export const Feedback: React.FC<FeedbackProps> = ({ isCorrect, isTimeUp, isBonus, reward }) => {
    const getFeedbackStyle = () => {
        if (isCorrect) {
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
        if (isCorrect) {
            const baseSubtitle = `+${reward.exp} XP, +${reward.crystals} Crystals`;
            const bonusSubtitle = isBonus ? '+5 Health' : '';

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
            className={`p-4 rounded-xl border ${getFeedbackStyle()}`}
        >
            <div className="text-center">
                <div className="text-2xl mb-2">{content.emoji}</div>
                <p className="font-bold">{content.title}</p>
                <p className="text-sm mt-1">{content.subtitle}</p>
                {isBonus && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full inline-block"
                    >
                        ✨ Consecutive Bonus!
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};