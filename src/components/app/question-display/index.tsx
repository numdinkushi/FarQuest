import { Question } from "~/types";
import { motion } from 'framer-motion';
import { getDifficultyColor } from "~/app/utils/get-diffulty-color";

interface QuestionDisplayProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    selectedAnswer: number | null;
    showFeedback: boolean;
    onAnswerSelect: (index: number) => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
    question,
    questionNumber,
    totalQuestions,
    selectedAnswer,
    showFeedback,
    onAnswerSelect
}) => {

    const getOptionStyle = (index: number) => {
        if (showFeedback) {
            if (index === question.correct) {
                return 'bg-green-600/30 text-green-400 border border-green-500/50';
            } else if (selectedAnswer === index) {
                return 'bg-red-600/30 text-red-400 border border-red-500/50';
            } else {
                return 'bg-gray-600/20 text-gray-400';
            }
        }
        return 'bg-purple-600/10 text-white hover:bg-purple-600/20 border border-purple-500/30 hover:border-purple-500/50';
    };

    return (
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
                <span className="text-purple-300 text-sm">
                    Question {questionNumber}/{totalQuestions}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty.toUpperCase()}
                </span>
            </div>
            <h3 className="text-white font-semibold mb-4">{question.question}</h3>

            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <motion.button
                        key={index}
                        onClick={() => !showFeedback && onAnswerSelect(index)}
                        disabled={showFeedback}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${getOptionStyle(index)}`}
                        whileHover={!showFeedback ? { scale: 1.02 } : {}}
                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    >
                        <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
