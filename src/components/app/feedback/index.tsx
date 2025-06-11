import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '~/types';

interface FeedbackProps {
    isCorrect: boolean;
    isTimeUp: boolean;
    reward: Question['reward'];
}

export const Feedback: React.FC<FeedbackProps> = ({ isCorrect, isTimeUp, reward }) => {
    const getFeedbackStyle = () => {
        if (isCorrect) {
            return 'bg-green-600/20 border-green-500/50 text-green-400';
        } else if (isTimeUp) {
            return 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400';
        } else {
            return 'bg-red-600/20 border-red-500/50 text-red-400';
        }
    };

    const getFeedbackContent = () => {
        if (isCorrect) {
            return {
                emoji: '🎉',
                title: 'Correct! Well done, adventurer!',
                subtitle: `+${reward.exp} XP, +${reward.crystals} Crystals`
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
            </div>
        </motion.div>
    );
};
