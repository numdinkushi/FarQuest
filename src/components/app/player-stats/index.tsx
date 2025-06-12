import { motion } from 'framer-motion';
import { PlayerStats, Difficulty } from '~/types';

interface PlayerStatsDisplayProps {
    stats: PlayerStats;
    currentDifficulty: Difficulty;
    questionInLevel: number;
}

export const PlayerStatsDisplay: React.FC<PlayerStatsDisplayProps> = ({
    stats,
    currentDifficulty,
    questionInLevel
}) => {
    const getDifficultyColor = (difficulty: Difficulty) => {
        const colors = {
            'Starter': 'from-green-400 to-green-600',
            'Novice': 'from-blue-400 to-blue-600',
            'Explorer': 'from-purple-400 to-purple-600',
            'Adventurer': 'from-indigo-400 to-indigo-600',
            'Legend': 'from-yellow-400 to-yellow-600',
            'Conqueror': 'from-orange-400 to-orange-600',
            'Star': 'from-pink-400 to-pink-600',
            'Galaxy': 'from-violet-400 to-violet-600',
            'Cosmic': 'from-cyan-400 to-cyan-600',
            'Oracle': 'from-teal-400 to-teal-600',
            'Sage': 'from-emerald-400 to-emerald-600',
            'Visionary': 'from-lime-400 to-lime-600',
            'Luminary': 'from-amber-400 to-amber-600',
            'Titan': 'from-red-400 to-red-600',
            'Farquest Master': 'from-gradient-to-r from-purple-400 via-pink-500 to-red-500'
        };
        return colors[difficulty] || 'from-gray-400 to-gray-600';
    };

    const getHealthColor = (health: number) => {
        // Normalize health to 0-1 range
        const normalizedHealth = Math.max(0, Math.min(100, health)) / 100;

        // Interpolate from red (255, 0, 0) to green (0, 255, 0)
        const red = Math.round(255 * (1 - normalizedHealth));
        const green = Math.round(255 * normalizedHealth);

        return `rgb(${red}, ${green}, 0)`;
    };

    const progressPercentage = (questionInLevel / 12) * 100;

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-600/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-purple-300 text-sm">Health</span>
                    <span className="text-white text-sm">{stats.health}%</span>
                </div>
                <div className="w-full bg-purple-900/50 rounded-full h-2">
                    <motion.div
                        className="h-2 rounded-full"
                        style={{
                            width: `${stats.health}%`,
                            backgroundColor: getHealthColor(stats.health)
                        }}
                        animate={{
                            width: `${stats.health}%`,
                            backgroundColor: getHealthColor(stats.health)
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                </div>
            </div>
            <div className="bg-blue-600/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-blue-300 text-sm">{currentDifficulty}</span>
                    <span className="text-white text-sm">💎 {stats.crystalsCollected}</span>
                </div>
                <div className="w-full bg-blue-900/50 rounded-full h-2">
                    <motion.div
                        className={`bg-gradient-to-r ${getDifficultyColor(currentDifficulty)} h-2 rounded-full`}
                        style={{ width: `${progressPercentage}%` }}
                        animate={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <div className="text-xs text-blue-300 mt-1">
                    {questionInLevel}/12
                </div>
            </div>
        </div>
    );
};