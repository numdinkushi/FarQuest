// components/QuizQuestion.tsx
import React from 'react';
import { Trophy, Zap, Star, Users, Award, ChevronRight, Check, X, Play, Coins } from 'lucide-react';
import { Question } from '~/types';
import MotionDiv from '~/components/animation/motion-div';


interface QuizQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  streak: number;
  totalRewards: number;
  animateScore: boolean;
  onAnswerSelect: (answerIndex: number) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  streak,
  totalRewards,
  animateScore,
  onAnswerSelect
}) => {
  const progress: number = ((currentQuestion + 1) / totalQuestions) * 100;

  const getAnswerStyle = (index: number): string => {
    if (selectedAnswer === null) {
      return "bg-white/90 backdrop-blur-md hover:bg-white border-white/30 hover:border-purple-300 text-gray-800 hover:scale-105 hover:shadow-xl";
    }

    if (index === question.correct) {
      return "bg-green-200/90 backdrop-blur-md border-green-400 text-green-800 animate-pulse scale-105 shadow-xl";
    }

    if (index === selectedAnswer && index !== question.correct) {
      return "bg-red-200/90 backdrop-blur-md border-red-400 text-red-800 animate-shake";
    }

    return "bg-gray-200/60 backdrop-blur-md border-gray-300 text-gray-600";
  };

  const getDifficultyStyle = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case 'Medium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'Hard':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Progress Header */}
      <MotionDiv animate="slideInLeft" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium animate-pulse ${getDifficultyStyle(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {streak > 0 && (
              <div className="flex items-center space-x-1 text-orange-600 animate-bounce">
                <Zap className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-bold">{streak}</span>
              </div>
            )}
            <div className={`flex items-center space-x-1 ${animateScore ? 'animate-bounce' : ''}`}>
              <Coins className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="font-bold text-blue-600">{totalRewards}</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg animate-pulse"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </MotionDiv>

      {/* Question Card */}
      <MotionDiv animate="fadeInUp" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-sm font-medium animate-pulse">
              {question.category}
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-sm font-medium animate-bounce">
              +{question.reward} CELO
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-relaxed">{question.question}</h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <MotionDiv
              key={index}
              animate="slideInLeft"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => onAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-300 ${getAnswerStyle(index)}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer === index && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </button>
            </MotionDiv>
          ))}
        </div>
      </MotionDiv>
    </div>
  );
};

export default QuizQuestion;