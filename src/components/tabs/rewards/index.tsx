// components/RewardsTab.tsx
import React from 'react';
import { Award, Coins, Check, Trophy, Star } from 'lucide-react';
import { AnsweredQuestion, Question } from '~/types';
import MotionDiv from '~/components/animation/motion-div';


interface RewardsTabProps {
    totalRewards: number;
    score: number;
    answeredQuestions: AnsweredQuestion[];
    questions: Question[];
}

const RewardsTab: React.FC<RewardsTabProps> = ({ totalRewards, score, answeredQuestions, questions }) => {
    return (
        <div className="space-y-6 pb-24">
            <MotionDiv animate="fadeInUp" className="bg-gradient-to-r from-green-400/95 to-blue-500/95 backdrop-blur-xl rounded-2xl p-6 text-white shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                    <Award className="w-8 h-8 animate-bounce" />
                    <h2 className="text-2xl font-bold">Rewards</h2>
                </div>
                <p className="text-white/90">Your earned tokens and NFTs</p>
            </MotionDiv>

            {/* Balance Card */}
            <MotionDiv animate="scaleIn" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
                        <Coins className="w-10 h-10 text-white animate-spin" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2 animate-bounce">{totalRewards} CELO</h3>
                    <p className="text-gray-600">Available Balance</p>
                </div>

                <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95">
                    Claim to Wallet
                </button>
            </MotionDiv>

            {/* NFT Rewards */}
            <MotionDiv animate="fadeInUp" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                <h3 className="text-lg font-semibold mb-4">Earned NFTs</h3>
                <div className="grid grid-cols-2 gap-4">
                    {score >= 3 && (
                        <MotionDiv animate="bounceIn" className="bg-gradient-to-br from-purple-200/80 to-pink-200/80 backdrop-blur-md rounded-xl p-4 border border-purple-300 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="w-full h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-3 flex items-center justify-center animate-pulse shadow-lg">
                                <Trophy className="w-8 h-8 text-white animate-bounce" />
                            </div>
                            <h4 className="font-semibold text-sm">Quiz Master</h4>
                            <p className="text-xs text-gray-600">Perfect Score NFT</p>
                        </MotionDiv>
                    )}
                    {totalRewards >= 50 && (
                        <MotionDiv animate="bounceIn" style={{ animationDelay: '0.2s' }} className="bg-gradient-to-br from-blue-200/80 to-cyan-200/80 backdrop-blur-md rounded-xl p-4 border border-blue-300 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="w-full h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg mb-3 flex items-center justify-center animate-pulse shadow-lg">
                                <Star className="w-8 h-8 text-white animate-spin" />
                            </div>
                            <h4 className="font-semibold text-sm">High Earner</h4>
                            <p className="text-xs text-gray-600">50+ CELO Earned</p>
                        </MotionDiv>
                    )}
                </div>
            </MotionDiv>

            {/* Transaction History */}
            <MotionDiv animate="slideInLeft" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                    {answeredQuestions
                        .filter((q) => q.isCorrect)
                        .map((_, index) => (
                            <MotionDiv
                                key={index}
                                animate="slideInLeft"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                className="flex items-center justify-between p-3 bg-gradient-to-r from-green-100/80 to-emerald-100/80 backdrop-blur-md rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center animate-pulse">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">Quiz Reward</span>
                                </div>
                                <span className="text-green-600 font-semibold animate-bounce">+{questions[index]?.reward || 10} CELO</span>
                            </MotionDiv>
                        ))}
                </div>
            </MotionDiv>
        </div>
    );
};

export default RewardsTab;
