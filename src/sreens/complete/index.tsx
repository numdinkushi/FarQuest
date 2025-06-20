import { PlayerStats } from "~/types";
import { motion } from 'framer-motion';

interface GameCompleteScreenProps {
    score: number;
    totalQuestions: number;
    stats: PlayerStats;
    isGameOver: boolean;
    onClaimRewards: () => void;
    onResetGame: () => void;
}

export const GameCompleteScreen: React.FC<GameCompleteScreenProps> = ({
    score,
    totalQuestions,
    stats,
    isGameOver,
    onClaimRewards,
    onResetGame
}) => {
    if (isGameOver) {
        // Game Over State - Health reached 0
        return (
            <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center space-y-6"
            >
                <div className="space-y-10  py-4">
                    <div className="text-6xl">💀</div>
                    <h2 className="text-2xl font-bold text-red-400">Game Over!</h2>
                    <p className="text-red-300">The dragon has defeated you...</p>

                    <div className="bg-gradient-to-r from-red-600/20 to-gray-600/20 rounded-xl p-4 space-y-2 border border-red-500/30">
                        <p className="text-white">
                            Questions Answered: <span className="font-bold text-yellow-400">{score}/{totalQuestions}</span>
                        </p>
                        <p className="text-white">
                            Level Reached: <span className="font-bold text-blue-400">{stats.level}</span>
                        </p>
                        <p className="text-white">
                            Crystals Collected: <span className="font-bold text-purple-400">💎 {stats.crystalsCollected}</span>
                        </p>
                        <p className="text-white">
                            Experience Gained: <span className="font-bold text-green-400">⭐ {stats.experience}</span>
                        </p>
                        <p className="text-red-400 font-bold">
                            ❤️ Health Depleted: 0%
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <motion.button
                        onClick={onResetGame}
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-blue-600 rounded-xl text-white font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        ⚔️ Try Again
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    // Quest Complete State - Successfully completed all questions
    return (
        <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-6"
        >
            <div className="space-y-4">
                <div className="text-6xl">🏆</div>
                <h2 className="text-2xl font-bold text-white">Quest Complete!</h2>
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 space-y-2">
                    <p className="text-white">
                        Final Score: <span className="font-bold text-yellow-400">{score}/{totalQuestions}</span>
                    </p>
                    <p className="text-white">
                        Level Reached: <span className="font-bold text-blue-400">{stats.level}</span>
                    </p>
                    <p className="text-white">
                        Crystals Collected: <span className="font-bold text-purple-400">💎 {stats.crystalsCollected}</span>
                    </p>
                    <p className="text-white">
                        Experience Gained: <span className="font-bold text-green-400">⭐ {stats.experience}</span>
                    </p>
                    <p className="text-white">
                        Health Remaining: <span className="font-bold text-red-400">❤️ {stats.health}%</span>
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <motion.button
                    onClick={onClaimRewards}
                    className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl text-white font-bold text-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    🎁 Claim Rewards in Celo
                </motion.button>

                <motion.button
                    onClick={onResetGame}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    🔄 Play Again
                </motion.button>
            </div>
        </motion.div>
    );
};