import { useState, useEffect } from 'react';
import { QUESTIONS } from '~/constants';
import { GameState, PlayerStats, WalletState, Difficulty } from '~/types';

const DIFFICULTY_ORDER: Difficulty[] = [
    'Starter', 'Novice', 'Explorer', 'Adventurer', 'Legend',
    'Conqueror', 'Star', 'Galaxy', 'Cosmic', 'Oracle',
    'Sage', 'Visionary', 'Luminary', 'Titan', 'Farquest Master'
];

const QUESTIONS_PER_LEVEL = 12;

export const useGameLogic = () => {
    const [wallet, setWallet] = useState<WalletState>({
        isConnected: false,
        address: ''
    });

    const [gameState, setGameState] = useState<GameState>({
        state: 'menu',
        currentQuestion: 0,
        score: 0,
        selectedAnswer: null,
        showFeedback: false,
        timeLeft: 30,
        isTimerActive: false
    });

    const [playerStats, setPlayerStats] = useState<PlayerStats>({
        health: 100,
        level: 1,
        experience: 0,
        crystalsCollected: 0
    });

    // Track consecutive correct answers for bonus system
    const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
    const [isBonus, setIsBonus] = useState<boolean>(false);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [levelCompleted, setLevelCompleted] = useState<boolean>(false);

    // Get current difficulty level based on questions answered
    const getCurrentDifficultyLevel = (): Difficulty => {
        const levelIndex = Math.floor(gameState.currentQuestion / QUESTIONS_PER_LEVEL);
        return DIFFICULTY_ORDER[Math.min(levelIndex, DIFFICULTY_ORDER.length - 1)];
    };

    // Get questions for current difficulty level
    const getCurrentLevelQuestions = () => {
        const currentDifficulty = getCurrentDifficultyLevel();
        return QUESTIONS.filter(q => q.difficulty === currentDifficulty).slice(0, QUESTIONS_PER_LEVEL);
    };

    // Get current question within the level
    const getCurrentQuestionInLevel = () => {
        const levelQuestions = getCurrentLevelQuestions();
        const questionIndexInLevel = gameState.currentQuestion % QUESTIONS_PER_LEVEL;
        return levelQuestions[questionIndexInLevel] || levelQuestions[0];
    };

    const totalNumberOfQuestions = DIFFICULTY_ORDER.length * QUESTIONS_PER_LEVEL;

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (gameState.isTimerActive && gameState.timeLeft > 0) {
            interval = setInterval(() => {
                setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
            }, 1000);
        } else if (gameState.timeLeft === 0) {
            handleTimeUp();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState.isTimerActive, gameState.timeLeft]);

    // Check for game over when health reaches 0
    useEffect(() => {
        if (playerStats.health <= 0 && gameState.state === 'playing') {
            setIsGameOver(true);
            setGameState(prev => ({ ...prev, state: 'complete', isTimerActive: false }));
        }
    }, [playerStats.health, gameState.state]);

    const connectWallet = async (): Promise<void> => {
        const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
        setWallet({
            isConnected: true,
            address: mockAddress
        });
    };

    const disconnectWallet = (): void => {
        setWallet({ isConnected: false, address: '' });
        setGameState(prev => ({ ...prev, state: 'menu' }));
    };

    const startGame = (): void => {
        setGameState({
            state: 'playing',
            currentQuestion: 0,
            score: 0,
            selectedAnswer: null,
            showFeedback: false,
            timeLeft: 30,
            isTimerActive: true
        });
        setPlayerStats({
            health: 100,
            level: 1,
            experience: 0,
            crystalsCollected: 0
        });
        setConsecutiveCorrect(0);
        setIsBonus(false);
        setIsGameOver(false);
        setLevelCompleted(false);
    };

    const handleAnswer = (answerIndex: number): void => {
        setGameState(prev => ({
            ...prev,
            selectedAnswer: answerIndex,
            showFeedback: true,
            isTimerActive: false
        }));

        const currentQuestion = getCurrentQuestionInLevel();
        const isCorrect = answerIndex === currentQuestion.correct;
        let bonusAwarded = false;

        if (isCorrect) {
            const newConsecutive = consecutiveCorrect + 1;
            setConsecutiveCorrect(newConsecutive);

            // Check for consecutive bonus (every 10 correct answers)
            if (newConsecutive % 10 === 0) {
                bonusAwarded = true;
                setIsBonus(true);
            }

            setGameState(prev => ({ ...prev, score: prev.score + 1 }));
            setPlayerStats(prev => {
                const newExp = prev.experience + currentQuestion.reward.exp;
                const healthBonus = bonusAwarded ? Math.ceil(prev.health * 0.05) : 0; // 5% health bonus
                const newHealth = Math.min(100, prev.health + healthBonus); // Cap at 100

                return {
                    ...prev,
                    health: newHealth,
                    experience: newExp,
                    crystalsCollected: prev.crystalsCollected + currentQuestion.reward.crystals,
                    level: Math.floor(gameState.currentQuestion / QUESTIONS_PER_LEVEL) + 1
                };
            });
        } else {
            // Reset consecutive count on wrong answer
            setConsecutiveCorrect(0);
            setIsBonus(false);

            setPlayerStats(prev => ({
                ...prev,
                health: Math.max(0, prev.health - 20)
            }));
        }

        setTimeout(() => {
            setIsBonus(false); // Reset bonus flag after showing feedback

            // Check if health is 0 or below before continuing
            if (playerStats.health - (isCorrect ? 0 : 20) <= 0) {
                setIsGameOver(true);
                setGameState(prev => ({ ...prev, state: 'complete', isTimerActive: false }));
                return;
            }

            // Check if level is completed (12 questions of current difficulty)
            const nextQuestion = gameState.currentQuestion + 1;
            const isLevelComplete = nextQuestion % QUESTIONS_PER_LEVEL === 0;

            if (isLevelComplete && nextQuestion < totalNumberOfQuestions) {
                setLevelCompleted(true);
                // Level completed, but more levels available
                setTimeout(() => {
                    setLevelCompleted(false);
                    setGameState(prev => ({
                        ...prev,
                        currentQuestion: nextQuestion,
                        selectedAnswer: null,
                        showFeedback: false,
                        timeLeft: 30,
                        isTimerActive: true
                    }));
                }, 3000); // Show level completion for 3 seconds
            } else if (nextQuestion < totalNumberOfQuestions) {
                // Continue to next question
                setGameState(prev => ({
                    ...prev,
                    currentQuestion: nextQuestion,
                    selectedAnswer: null,
                    showFeedback: false,
                    timeLeft: 30,
                    isTimerActive: true
                }));
            } else {
                // All questions completed
                setIsGameOver(false);
                setGameState(prev => ({ ...prev, state: 'complete', isTimerActive: false }));
            }
        }, 2000);
    };

    const handleTimeUp = (): void => {
        setGameState(prev => ({ ...prev, isTimerActive: false, showFeedback: true }));

        // Reset consecutive count on time up
        setConsecutiveCorrect(0);
        setIsBonus(false);

        setPlayerStats(prev => ({ ...prev, health: Math.max(0, prev.health - 20) }));

        setTimeout(() => {
            // Check if health is 0 or below before continuing
            if (playerStats.health - 20 <= 0) {
                setIsGameOver(true);
                setGameState(prev => ({ ...prev, state: 'complete' }));
                return;
            }

            // Check if level is completed (12 questions of current difficulty)
            const nextQuestion = gameState.currentQuestion + 1;
            const isLevelComplete = nextQuestion % QUESTIONS_PER_LEVEL === 0;

            if (isLevelComplete && nextQuestion < totalNumberOfQuestions) {
                setLevelCompleted(true);
                // Level completed, but more levels available
                setTimeout(() => {
                    setLevelCompleted(false);
                    setGameState(prev => ({
                        ...prev,
                        currentQuestion: nextQuestion,
                        selectedAnswer: null,
                        showFeedback: false,
                        timeLeft: 30,
                        isTimerActive: true
                    }));
                }, 3000); // Show level completion for 3 seconds
            } else if (nextQuestion < totalNumberOfQuestions) {
                // Continue to next question
                setGameState(prev => ({
                    ...prev,
                    currentQuestion: nextQuestion,
                    selectedAnswer: null,
                    showFeedback: false,
                    timeLeft: 30,
                    isTimerActive: true
                }));
            } else {
                // All questions completed
                setIsGameOver(false);
                setGameState(prev => ({ ...prev, state: 'complete' }));
            }
        }, 2000);
    };

    const claimRewards = async (): Promise<void> => {
        setGameState(prev => ({ ...prev, state: 'rewards' }));
        setTimeout(() => {
            alert(`🎉 Rewards claimed!\n💎 ${playerStats.crystalsCollected} Crystals\n⭐ ${playerStats.experience} XP\n🏆 Level ${playerStats.level} NFT minted!`);
            resetGame();
        }, 2000);
    };

    const resetGame = (): void => {
        setGameState({
            state: 'menu',
            currentQuestion: 0,
            score: 0,
            selectedAnswer: null,
            showFeedback: false,
            timeLeft: 30,
            isTimerActive: false
        });
        setConsecutiveCorrect(0);
        setIsBonus(false);
        setIsGameOver(false);
        setLevelCompleted(false);
    };

    return {
        wallet,
        gameState,
        playerStats,
        consecutiveCorrect,
        isBonus,
        isGameOver,
        levelCompleted,
        connectWallet,
        disconnectWallet,
        startGame,
        handleAnswer,
        claimRewards,
        resetGame,
        currentQuestion: getCurrentQuestionInLevel(),
        totalNumberOfQuestions,
        currentDifficulty: getCurrentDifficultyLevel(),
        questionInLevel: (gameState.currentQuestion % QUESTIONS_PER_LEVEL) + 1
    };
};