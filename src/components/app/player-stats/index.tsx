import { motion } from 'framer-motion';
import { PlayerStats } from '~/types';


interface PlayerStatsDisplayProps {
    stats: PlayerStats;
}

export const PlayerStatsDisplay: React.FC<PlayerStatsDisplayProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-600/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-purple-300 text-sm">Health</span>
                    <span className="text-white text-sm">{stats.health}%</span>
                </div>
                <div className="w-full bg-purple-900/50 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${stats.health}%` }}
                        animate={{ width: `${stats.health}%` }}
                    />
                </div>
            </div>
            <div className="bg-blue-600/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-blue-300 text-sm">Level {stats.level}</span>
                    <span className="text-white text-sm">💎 {stats.crystalsCollected}</span>
                </div>
                <div className="w-full bg-blue-900/50 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${stats.experience % 100}%` }}
                        animate={{ width: `${stats.experience % 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
