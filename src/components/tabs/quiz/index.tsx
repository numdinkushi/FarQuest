// components/QuizTab.tsx
import React from 'react';
import { Trophy, Zap, Star, Users, Award, ChevronRight, Check, X, Play, Coins } from 'lucide-react';
import { AnsweredQuestion, Question } from '~/types';
import MotionDiv from '~/components/animation/motion-div';
import QuizResults from './quiz-results';
import QuizQuestion from './question';


interface QuizTabProps {
    gameStarted: boolean;
    showResult: boolean;
    currentQuestion: number;
    questions: Question[];
    selectedAnswer: number | null;
    score: number;
    streak: number;
    totalRewards: number;
    animateScore: boolean;
    answeredQuestions: AnsweredQuestion[];
    onStartGame: () => void;
    onAnswerSelect: (answerIndex: number) => void;
    onResetQuiz: () => void;
    onClaimRewards: () => void;
}

const QuizTab: React.FC<QuizTabProps> = ({
    gameStarted,
    showResult,
    currentQuestion,
    questions,
    selectedAnswer,
    score,
    streak,
    totalRewards,
    animateScore,
    answeredQuestions,
    onStartGame,
    onAnswerSelect,
    onResetQuiz,
    onClaimRewards
}) => {
    if (!gameStarted) {
        return (
            <MotionDiv animate="scaleIn" className="flex items-center justify-center min-h-96">
                <div className="text-center bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
                    <Zap className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ready to Start?</h2>
                    <p className="text-gray-600 mb-6">Test your Web3 knowledge!</p>
                    <button
                        onClick={onStartGame}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-2xl transition-all transform hover:scale-110 active:scale-95"
                    >
                        Begin Quiz
                    </button>
                </div>
            </MotionDiv>
        );
    }

    if (showResult) {
        return (
            <QuizResults
                score={score}
                questions={questions}
                answeredQuestions={answeredQuestions}
                onResetQuiz={onResetQuiz}
                onClaimRewards={onClaimRewards}
            />
        );
    }

    return (
        <QuizQuestion
            question={questions[currentQuestion]}
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            streak={streak}
            totalRewards={totalRewards}
            animateScore={animateScore}
            onAnswerSelect={onAnswerSelect}
        />
    );
};

export default QuizTab;