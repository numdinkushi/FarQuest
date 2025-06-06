// components/LeaderboardTab.tsx
import React from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '~/types';
import MotionDiv from '~/components/animation/motion-div';


interface LeaderboardTabProps {
    leaderboard: LeaderboardEntry[];
}

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ leaderboard }) => {
    return (
        <div className="space-y-6 pb-24">
            <MotionDiv animate="fadeInUp" className="bg-gradient-to-r from-yellow-400/95 to-orange-500/95 backdrop-blur-xl rounded-2xl p-6 text-white shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                    <Trophy className="w-8 h-8 animate-bounce" />
                    <h2 className="text-2xl font-bold">Leaderboard</h2>
                </div>
                <p className="text-white/90">Compete with other players worldwide!</p>
            </MotionDiv>

            <MotionDiv animate="scaleIn" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                <div className="space-y-4">
                    {leaderboard.map((player, index) => (
                        <MotionDiv
                            key={index}
                            animate="slideInLeft"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 ${player.name === 'You'
                                    ? 'bg-gradient-to-r from-blue-100/80 to-purple-100/80 border-2 border-blue-300 shadow-lg'
                                    : 'bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-md'
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${player.rank === 1
                                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white animate-pulse'
                                            : player.rank === 2
                                                ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
                                                : player.rank === 3
                                                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                                                    : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
                                        }`}
                                >
                                    {player.rank <= 3 ? <Trophy className="w-5 h-5" /> : player.rank}
                                </div>
                                <div>
                                    <p className={`font-semibold ${player.name === 'You' ? 'text-blue-800' : 'text-gray-800'}`}>
                                        {player.name}
                                    </p>
                                    <p className="text-sm text-gray-600">{player.score} points</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600 animate-pulse">{player.rewards} CELO</p>
                                <p className="text-xs text-gray-500">earned</p>
                            </div>
                        </MotionDiv>
                    ))}
                </div>
            </MotionDiv>
        </div>
    );
};

export default LeaderboardTab;
