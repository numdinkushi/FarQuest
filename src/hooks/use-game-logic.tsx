import { useState, useEffect } from 'react';
import { useConvexGame } from './use-convex-game';
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

    // Add user creation state
    const [userCreationError, setUserCreationError] = useState<string | null>(null);
    const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);

    // Convex integration
    const {
        user,
        isUserCreated,
        createUser,
        startGame: startConvexGame,
        updateProgress,
        answerQuestion,
        completeLevel,
        endGame,
        claimRewards: claimConvexRewards,
        error: convexError,
        clearError
    } = useConvexGame(wallet.address);

    // Sync local state with Convex user data
    useEffect(() => {
        if (user) {
            setGameState(prev => ({
                ...prev,
                currentQuestion: user.currentQuestion,
                score: user.score
            }));
            setPlayerStats({
                health: user.health,
                level: user.level,
                experience: user.experience,
                crystalsCollected: user.crystalsCollected
            });
            setConsecutiveCorrect(user.consecutiveCorrect);
        }
    }, [user]);

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
            endGame('health_depleted');
        }
    }, [playerStats.health, gameState.state, endGame]);

    // Enhanced wallet connection with better error handling
    const connectWallet = async (): Promise<void> => {
        try {
            // Check for MetaMask/Web3 wallet
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts'
                    });
                    if (accounts.length > 0) {
                        setWallet({
                            isConnected: true,
                            address: accounts[0]
                        });
                        return;
                    }
                } catch (walletError) {
                    console.warn('MetaMask connection failed, using mock wallet:', walletError);
                }
            }

            // Fallback to mock wallet for development
            const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
            setWallet({
                isConnected: true,
                address: mockAddress
            });
        } catch (error) {
            console.error('Wallet connection failed:', error);
            throw new Error('Failed to connect wallet');
        }
    };

    const disconnectWallet = (): void => {
        setWallet({ isConnected: false, address: '' });
        setGameState(prev => ({ ...prev, state: 'menu' }));
        setUserCreationError(null);
    };

    // Enhanced user creation with better error handling
    const createUserWithUsername = async (username: string, isOG?: boolean): Promise<void> => {
        if (!wallet.address) {
            throw new Error('Wallet not connected');
        }

        if (!username || username.trim().length === 0) {
            throw new Error('Username is required');
        }

        setIsCreatingUser(true);
        setUserCreationError(null);

        try {
            await createUser(username.trim(), wallet.address, isOG);
        } catch (error) {
            console.error('Failed to create user:', error);
            setUserCreationError(error instanceof Error ? error.message : 'Failed to create user');
            throw error;
        } finally {
            setIsCreatingUser(false);
        }
    };

    // Enhanced startGame with better validation
    const startGame = async (): Promise<void> => {
        // Validate prerequisites
        if (!wallet.isConnected) {
            throw new Error('Wallet must be connected before starting game');
        }

        if (!isUserCreated) {
            throw new Error('User must be created before starting game');
        }

        try {
            // Start Convex game session
            await startConvexGame();

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
        } catch (error) {
            console.error('Failed to start game:', error);
            throw new Error('Failed to start game session');
        }
    };

    const handleAnswer = async (answerIndex: number): Promise<void> => {
        if (gameState.selectedAnswer !== null) {
            return; // Prevent multiple answers
        }

        setGameState(prev => ({
            ...prev,
            selectedAnswer: answerIndex,
            showFeedback: true,
            isTimerActive: false
        }));

        const currentQuestion = getCurrentQuestionInLevel();
        const isCorrect = answerIndex === currentQuestion.correct;
        let bonusAwarded = false;

        try {
            // Update question statistics in Convex
            await answerQuestion(isCorrect);

            if (isCorrect) {
                const newConsecutive = consecutiveCorrect + 1;
                setConsecutiveCorrect(newConsecutive);

                // Check for consecutive bonus (every 10 correct answers)
                if (newConsecutive % 10 === 0) {
                    bonusAwarded = true;
                    setIsBonus(true);
                }

                const newScore = gameState.score + 1;
                const newExp = playerStats.experience + currentQuestion.reward.exp;
                const healthBonus = bonusAwarded ? Math.ceil(playerStats.health * 0.05) : 0;
                const newHealth = Math.min(100, playerStats.health + healthBonus);
                const newLevel = Math.floor(gameState.currentQuestion / QUESTIONS_PER_LEVEL) + 1;
                const newCrystals = playerStats.crystalsCollected + currentQuestion.reward.crystals;

                setGameState(prev => ({ ...prev, score: newScore }));
                setPlayerStats(prev => ({
                    ...prev,
                    health: newHealth,
                    experience: newExp,
                    crystalsCollected: newCrystals,
                    level: newLevel
                }));

                // Update progress in Convex
                await updateProgress({
                    currentQuestion: gameState.currentQuestion,
                    questionInLevel: (gameState.currentQuestion % QUESTIONS_PER_LEVEL) + 1,
                    currentDifficulty: getCurrentDifficultyLevel(),
                    health: newHealth,
                    level: newLevel,
                    experience: newExp,
                    crystalsCollected: newCrystals,
                    consecutiveCorrect: newConsecutive,
                    score: newScore
                });
            } else {
                // Reset consecutive count on wrong answer
                setConsecutiveCorrect(0);
                setIsBonus(false);

                const newHealth = Math.max(0, playerStats.health - 20);
                setPlayerStats(prev => ({
                    ...prev,
                    health: newHealth
                }));

                // Update progress in Convex
                await updateProgress({
                    currentQuestion: gameState.currentQuestion,
                    questionInLevel: (gameState.currentQuestion % QUESTIONS_PER_LEVEL) + 1,
                    currentDifficulty: getCurrentDifficultyLevel(),
                    health: newHealth,
                    level: playerStats.level,
                    experience: playerStats.experience,
                    crystalsCollected: playerStats.crystalsCollected,
                    consecutiveCorrect: 0,
                    score: gameState.score
                });
            }
        } catch (error) {
            console.error('Failed to process answer:', error);
            // Continue with local state even if Convex fails
        }

        setTimeout(async () => {
            setIsBonus(false); // Reset bonus flag after showing feedback

            // Check if health is 0 or below before continuing
            const finalHealth = isCorrect ?
                Math.min(100, playerStats.health + (bonusAwarded ? Math.ceil(playerStats.health * 0.05) : 0)) :
                Math.max(0, playerStats.health - 20);

            if (finalHealth <= 0) {
                setIsGameOver(true);
                setGameState(prev => ({ ...prev, state: 'complete', isTimerActive: false }));
                try {
                    await endGame('health_depleted');
                } catch (error) {
                    console.error('Failed to end game:', error);
                }
                return;
            }

            // Check if level is completed (12 questions of current difficulty)
            const nextQuestion = gameState.currentQuestion + 1;
            const isLevelComplete = nextQuestion % QUESTIONS_PER_LEVEL === 0;

            if (isLevelComplete && nextQuestion < totalNumberOfQuestions) {
                try {
                    // Mark level as completed in Convex
                    await completeLevel(getCurrentDifficultyLevel());
                } catch (error) {
                    console.error('Failed to complete level:', error);
                }
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
                try {
                    await endGame('completed');
                } catch (error) {
                    console.error('Failed to end game:', error);
                }
            }
        }, 2000);
    };

    const handleTimeUp = async (): Promise<void> => {
        if (gameState.showFeedback) {
            return; // Prevent multiple time up events
        }

        setGameState(prev => ({ ...prev, isTimerActive: false, showFeedback: true }));

        // Reset consecutive count on time up
        setConsecutiveCorrect(0);
        setIsBonus(false);

        try {
            // Update question statistics in Convex (time up counts as wrong answer)
            await answerQuestion(false);

            const newHealth = Math.max(0, playerStats.health - 20);
            setPlayerStats(prev => ({ ...prev, health: newHealth }));

            // Update progress in Convex
            await updateProgress({
                currentQuestion: gameState.currentQuestion,
                questionInLevel: (gameState.currentQuestion % QUESTIONS_PER_LEVEL) + 1,
                currentDifficulty: getCurrentDifficultyLevel(),
                health: newHealth,
                level: playerStats.level,
                experience: playerStats.experience,
                crystalsCollected: playerStats.crystalsCollected,
                consecutiveCorrect: 0,
                score: gameState.score
            });
        } catch (error) {
            console.error('Failed to process time up:', error);
            // Continue with local state even if Convex fails
            const newHealth = Math.max(0, playerStats.health - 20);
            setPlayerStats(prev => ({ ...prev, health: newHealth }));
        }

        setTimeout(async () => {
            // Check if health is 0 or below before continuing
            const newHealth = Math.max(0, playerStats.health - 20);
            if (newHealth <= 0) {
                setIsGameOver(true);
                setGameState(prev => ({ ...prev, state: 'complete' }));
                try {
                    await endGame('health_depleted');
                } catch (error) {
                    console.error('Failed to end game:', error);
                }
                return;
            }

            // Check if level is completed (12 questions of current difficulty)
            const nextQuestion = gameState.currentQuestion + 1;
            const isLevelComplete = nextQuestion % QUESTIONS_PER_LEVEL === 0;

            if (isLevelComplete && nextQuestion < totalNumberOfQuestions) {
                try {
                    // Mark level as completed in Convex
                    await completeLevel(getCurrentDifficultyLevel());
                } catch (error) {
                    console.error('Failed to complete level:', error);
                }
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
                try {
                    await endGame('completed');
                } catch (error) {
                    console.error('Failed to end game:', error);
                }
            }
        }, 2000);
    };

    const claimRewards = async (): Promise<void> => {
        setGameState(prev => ({ ...prev, state: 'rewards' }));

        try {
            const rewards = await claimConvexRewards();
            setTimeout(() => {
                alert(`🎉 Rewards claimed!\n💎 ${rewards?.crystals || 0} Crystals\n⭐ ${rewards?.experience || 0} XP\n🏆 Level ${rewards?.level || 1} NFT minted!`);
                resetGame();
            }, 2000);
        } catch (error) {
            console.error('Failed to claim rewards:', error);
            // Fallback to local data if Convex fails
            setTimeout(() => {
                alert(`🎉 Rewards claimed!\n💎 ${playerStats.crystalsCollected} Crystals\n⭐ ${playerStats.experience} XP\n🏆 Level ${playerStats.level} NFT minted!`);
                resetGame();
            }, 2000);
        }
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
        setUserCreationError(null);
    };

    return {
        wallet,
        gameState,
        playerStats,
        consecutiveCorrect,
        isBonus,
        isGameOver,
        levelCompleted,

        // User creation state
        userCreationError,
        isCreatingUser,

        // Convex integration
        user,
        isUserCreated,
        convexError,
        clearError,

        // Actions
        connectWallet,
        disconnectWallet,
        createUserWithUsername,
        startGame,
        handleAnswer,
        claimRewards,
        resetGame,

        // Computed values
        currentQuestion: getCurrentQuestionInLevel(),
        totalNumberOfQuestions,
        currentDifficulty: getCurrentDifficultyLevel(),
        questionInLevel: (gameState.currentQuestion % QUESTIONS_PER_LEVEL) + 1
    };
};