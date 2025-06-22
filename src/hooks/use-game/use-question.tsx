import { QUESTIONS } from '~/constants';
import { Difficulty } from '~/types';

const DIFFICULTY_ORDER: Difficulty[] = [
    'Starter', 'Novice', 'Explorer', 'Adventurer', 'Legend',
    'Conqueror', 'Star', 'Galaxy', 'Cosmic', 'Oracle',
    'Sage', 'Visionary', 'Luminary', 'Titan', 'Farquest Master'
];

// const DIFFICULTY_ORDER: Difficulty[] = [
//     'Starter', 'Novice', 'Explorer',
// ];

const QUESTIONS_PER_LEVEL = 12;
// const QUESTIONS_PER_LEVEL = 2;

export const useQuestionManager = () => {
    const totalNumberOfQuestions = DIFFICULTY_ORDER.length * QUESTIONS_PER_LEVEL;

    // Get current difficulty level based on questions answered
    const getCurrentDifficultyLevel = (currentQuestion: number): Difficulty => {
        const levelIndex = Math.floor(currentQuestion / QUESTIONS_PER_LEVEL);
        return DIFFICULTY_ORDER[Math.min(levelIndex, DIFFICULTY_ORDER.length - 1)];
    };

    // Get questions for current difficulty level
    const getCurrentLevelQuestions = (currentQuestion: number) => {
        const currentDifficulty = getCurrentDifficultyLevel(currentQuestion);
        return QUESTIONS.filter(q => q.difficulty === currentDifficulty).slice(0, QUESTIONS_PER_LEVEL);
    };

    // Get current question within the level
    const getCurrentQuestionInLevel = (currentQuestion: number) => {
        const levelQuestions = getCurrentLevelQuestions(currentQuestion);
        const questionIndexInLevel = currentQuestion % QUESTIONS_PER_LEVEL;
        return levelQuestions[questionIndexInLevel] || levelQuestions[0];
    };

    // Get question index within current level (1-based)
    const getQuestionInLevel = (currentQuestion: number): number => {
        return (currentQuestion % QUESTIONS_PER_LEVEL) + 1;
    };

    // Check if current level is completed
    const isLevelComplete = (currentQuestion: number): boolean => {
        return (currentQuestion + 1) % QUESTIONS_PER_LEVEL === 0;
    };

    // Check if all questions are completed
    const isAllQuestionsComplete = (currentQuestion: number): boolean => {
        return (currentQuestion + 1) >= totalNumberOfQuestions;
    };

    // Get level progress (0-1)
    const getLevelProgress = (currentQuestion: number): number => {
        const questionInLevel = getQuestionInLevel(currentQuestion);
        return questionInLevel / QUESTIONS_PER_LEVEL;
    };

    // Get overall progress (0-1)
    const getOverallProgress = (currentQuestion: number): number => {
        return (currentQuestion + 1) / totalNumberOfQuestions;
    };

    // Get current level number (1-based)
    const getCurrentLevel = (currentQuestion: number): number => {
        return Math.floor(currentQuestion / QUESTIONS_PER_LEVEL) + 1;
    };

    return {
        totalNumberOfQuestions,
        getCurrentDifficultyLevel,
        getCurrentLevelQuestions,
        getCurrentQuestionInLevel,
        getQuestionInLevel,
        isLevelComplete,
        isAllQuestionsComplete,
        getLevelProgress,
        getOverallProgress,
        getCurrentLevel,
        DIFFICULTY_ORDER,
        QUESTIONS_PER_LEVEL
    };
};