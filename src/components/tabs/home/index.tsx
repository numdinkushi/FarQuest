// components/HomeTab.tsx
import React from 'react';
import { Trophy, Zap, Star, Users, Award, ChevronRight, Check, X, Play, Coins } from 'lucide-react';
import { Achievement } from '~/types';
import MotionDiv from '~/components/animation/motion-div';


interface HomeTabProps {
    totalRewards: number;
    score: number;
    animateScore: boolean;
    onStartGame: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ totalRewards, score, animateScore, onStartGame }) => {
    const achievements: Achievement[] = [
        { icon: Award, text: "Completed Blockchain Basics", reward: "+15 CELO", color: "bg-gradient-to-br from-yellow-400 to-orange-500" },
        { icon: Zap, text: "3-question streak!", reward: "+5 CELO", color: "bg-gradient-to-br from-purple-400 to-pink-500" },
        { icon: Star, text: "Perfect score bonus", reward: "+10 CELO", color: "bg-gradient-to-br from-blue-400 to-cyan-500" }
    ];

    return (
        <div className="space-y-6 pb-24">
            {/* Hero Section */}
            <MotionDiv
                animate="fadeInUp"
                className="relative bg-gradient-to-br from-purple-600/95 via-blue-600/95 to-cyan-500/95 backdrop-blur-xl rounded-3xl p-8 text-white overflow-hidden shadow-2xl"
            >
                <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
                <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white/10 animate-pulse"
                            style={{
                                width: Math.random() * 30 + 10,
                                height: Math.random() * 30 + 10,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${2 + i}s`
                            }}
                        />
                    ))}
                </div>
                <div className="relative z-10">
                    <MotionDiv animate="slideInLeft" className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Zap className="w-8 h-8 text-yellow-300 animate-bounce" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">FarQuiz</span>
                        </div>
                        <div className={`flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1 ${animateScore ? 'animate-bounce' : ''}`}>
                            <Coins className="w-4 h-4 animate-spin" />
                            <span className="font-semibold">{totalRewards}</span>
                        </div>
                    </MotionDiv>
                    <MotionDiv animate="fadeInUp" className="space-y-4">
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">Web3 Knowledge Challenge</h1>
                        <p className="text-white/90 mb-6">Test your crypto knowledge and earn rewards!</p>
                        <button
                            onClick={onStartGame}
                            className="bg-white text-purple-600 px-8 py-3 rounded-2xl font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-all transform hover:scale-110 hover:shadow-2xl active:scale-95"
                        >
                            <Play className="w-5 h-5 animate-pulse" />
                            <span>Start Quiz</span>
                        </button>
                    </MotionDiv>
                </div>
            </MotionDiv>

            {/* Stats Cards */}
            <MotionDiv animate="scaleIn" className="grid grid-cols-2 gap-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center animate-pulse">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Best Score</p>
                            <p className="text-2xl font-bold text-gray-900">{Math.max(score, 3)}/5</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center animate-pulse">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Rewards</p>
                            <p className="text-2xl font-bold text-gray-900">{totalRewards}</p>
                        </div>
                    </div>
                </div>
            </MotionDiv>

            {/* Recent Activity */}
            <MotionDiv animate="fadeInUp" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Recent Achievements</h3>
                <div className="space-y-3">
                    {achievements.map((item, index) => (
                        <MotionDiv
                            key={index}
                            animate="slideInLeft"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-md rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} text-white animate-pulse`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-800">{item.text}</span>
                            </div>
                            <span className="text-green-600 font-semibold animate-bounce">{item.reward}</span>
                        </MotionDiv>
                    ))}
                </div>
            </MotionDiv>
        </div>
    );
};

export default HomeTab;