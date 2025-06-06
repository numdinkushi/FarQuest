// components/QuizResults.tsx
import React from 'react';
import { Trophy, Coins, Check, X } from 'lucide-react';
import MotionDiv from '~/components/animation/motion-div';
import { AnsweredQuestion, Question } from '~/types';

interface QuizResultsProps {
    score: number;
    questions: Question[];
    answeredQuestions: AnsweredQuestion[];
    onResetQuiz: () => void;
    onClaimRewards: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
    score,
    questions,
    answeredQuestions,
    onResetQuiz,
    onClaimRewards
}) => {
    const percentage: number = Math.round((score / questions.length) * 100);
    const earnedRewards = answeredQuestions.reduce((sum, q) => {
        return sum + (q.isCorrect ? questions[q.question].reward : 0);
    }, 0);

    return (
        <div className="space-y-6 pb-24">
            <MotionDiv animate="bounceIn" className="text-center bg-gradient-to-br from-green-400/95 to-blue-500/95 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl">
                <Trophy className={`w-20 h-20 mx-auto mb-4 ${score >= 4 ? 'animate-bounce text-yellow-300' : 'text-white'}`} />
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <div className="text-6xl font-bold mb-2 animate-pulse">{score}/{questions.length}</div>
                <p className="text-xl mb-4">{percentage}% Correct</p>
                <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-full px-4 py-2 inline-flex animate-bounce">
                    <Coins className="w-5 h-5 animate-spin" />
                    <span className="font-bold">+{earnedRewards} CELO Earned!</span>
                </div>
            </MotionDiv>

            <MotionDiv animate="fadeInUp" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                <h3 className="text-lg font-semibold mb-4">Question Review</h3>
                <div className="space-y-3">
                    {answeredQuestions.map((answer, index) => {
                        const question = questions[answer.question];
                        return (
                            <MotionDiv
                                key={index}
                                animate="slideInLeft"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                className="p-4 rounded-xl border border-white/30 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-md hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <p className="font-medium text-sm text-gray-800">{question.question}</p>
                                    {answer.isCorrect ? (
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 ml-2 animate-bounce" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-500 flex-shrink-0 ml-2 animate-pulse" />
                                    )}
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-600">
                                        Your answer: <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>{question.options[answer.selected]}</span>
                                    </p>
                                    {!answer.isCorrect && (
                                        <p className="text-gray-600">
                                            Correct: <span className="text-green-600">{question.options[answer.correct]}</span>
                                        </p>
                                    )}
                                </div>
                            </MotionDiv>
                        );
                    })}
                </div>
            </MotionDiv>

            <MotionDiv animate="scaleIn" className="flex space-x-4">
                <button
                    onClick={onResetQuiz}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                >
                    Play Again
                </button>
                <button
                    onClick={onClaimRewards}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-2xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                >
                    Claim Rewards
                </button>
            </MotionDiv>
        </div>
    );
};

export default QuizResults;
