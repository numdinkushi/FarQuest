import { useEffect } from 'react';
import { useWallet } from './use-wallet';
import { useGameState } from './use-game-state';
import { usePlayerStats } from './use-player-stats';
import { useConvexGame } from '../use-convex-game';
import { useGameMechanics } from './use-game-mechanics';
import { useQuestionManager } from './use-question';
import { useUserManagement } from './use-user';
import { toast } from 'react-toastify';

export const useGameLogic = () => {
    // Initialize all sub-hooks
    const wallet = useWallet();
    const gameStateHook = useGameState();
    const playerStatsHook = usePlayerStats();
    const mechanicsHook = useGameMechanics();
    const questionManager = useQuestionManager();
    const userManagement = useUserManagement(wallet.wallet.address);

    // Convex game operations
    const {
        startGame: startConvexGame,
        updateProgress,
        answerQuestion,
        completeLevel,
        endGame,
        claimRewards: claimConvexRewards,
    // } = useConvexGame(wallet.wallet.address);
    } = useConvexGame('kushiadsrwaseq');

    // Sync local state with Convex user data
    useEffect(() => {
        if (userManagement.user) {
            gameStateHook.setGameState(prev => ({
                ...prev,
                currentQuestion: userManagement.user.currentQuestion,
                score: userManagement.user.score
            }));
            playerStatsHook.setPlayerStats({
                health: userManagement.user.health,
                level: userManagement.user.level,
                experience: userManagement.user.experience,
                crystalsCollected: userManagement.user.crystalsCollected
            });
            mechanicsHook.setConsecutiveCorrect(userManagement.user.consecutiveCorrect);
        }
    }, [userManagement.user]);

    // Handle timer reaching zero
    useEffect(() => {
        if (gameStateHook.gameState.timeLeft === 0 && gameStateHook.gameState.isTimerActive) {
            handleTimeUp();
        }
    }, [gameStateHook.gameState.timeLeft, gameStateHook.gameState.isTimerActive]);

    // Check for game over when health reaches 0
    useEffect(() => {
        if (playerStatsHook.playerStats.health <= 0 && gameStateHook.gameState.state === 'playing') {
            mechanicsHook.setGameOverState(true);
            gameStateHook.completeGame();
            endGame('health_depleted');
        }
    }, [playerStatsHook.playerStats.health, gameStateHook.gameState.state]);

    // Enhanced startGame with better validation
    const startGame = async (): Promise<void> => {
        // if (!wallet.wallet.isConnected) {
        //     throw new Error('Wallet must be connected before starting game');
        // }

        // if (!userManagement.isUserCreated) {
        //     throw new Error('User must be created before starting game');
        // }

        try {
            // Start Convex game session
            const abc =  await startConvexGame();
            console.log('Game session started successfully', abc);
            gameStateHook.startGameState();
            playerStatsHook.resetStats();
            mechanicsHook.resetMechanics();
        } catch (error) {
            console.log('Failed to start game:', error);
            throw new Error('Failed to start game session');
        }
    };

    const handleAnswer = async (answerIndex: number): Promise<void> => {
        if (gameStateHook.gameState.selectedAnswer !== null) {
            return; // Prevent multiple answers
        }

        gameStateHook.setAnswer(answerIndex);

        const currentQuestion = questionManager.getCurrentQuestionInLevel(gameStateHook.gameState.currentQuestion);
        const isCorrect = answerIndex === currentQuestion.correct;
        let bonusAwarded = false;

        try {
            // Update question statistics in Convex
            await answerQuestion(isCorrect);

            if (isCorrect) {
                const newConsecutive = mechanicsHook.incrementConsecutive();

                // Check for consecutive bonus (every 10 correct answers)
                if (newConsecutive % 10 === 0) {
                    bonusAwarded = true;
                }

                gameStateHook.incrementScore();
                playerStatsHook.addExperience(currentQuestion.reward.exp);
                playerStatsHook.addCrystals(currentQuestion.reward.crystals);

                if (bonusAwarded) {
                    const healthBonus = mechanicsHook.calculateHealthBonus(playerStatsHook.playerStats.health);
                    playerStatsHook.healPlayer(healthBonus);
                }

                const newLevel = questionManager.getCurrentLevel(gameStateHook.gameState.currentQuestion);
                playerStatsHook.updateLevel(newLevel);

                // Update progress in Convex
                await updateProgress({
                    currentQuestion: gameStateHook.gameState.currentQuestion,
                    questionInLevel: questionManager.getQuestionInLevel(gameStateHook.gameState.currentQuestion),
                    currentDifficulty: questionManager.getCurrentDifficultyLevel(gameStateHook.gameState.currentQuestion),
                    health: playerStatsHook.playerStats.health,
                    level: newLevel,
                    experience: playerStatsHook.playerStats.experience,
                    crystalsCollected: playerStatsHook.playerStats.crystalsCollected,
                    consecutiveCorrect: newConsecutive,
                    score: gameStateHook.gameState.score
                });
            } else {
                // Reset consecutive count on wrong answer
                mechanicsHook.resetConsecutive();
                playerStatsHook.takeDamage(20);

                // Update progress in Convex
                await updateProgress({
                    currentQuestion: gameStateHook.gameState.currentQuestion,
                    questionInLevel: questionManager.getQuestionInLevel(gameStateHook.gameState.currentQuestion),
                    currentDifficulty: questionManager.getCurrentDifficultyLevel(gameStateHook.gameState.currentQuestion),
                    health: playerStatsHook.playerStats.health,
                    level: playerStatsHook.playerStats.level,
                    experience: playerStatsHook.playerStats.experience,
                    crystalsCollected: playerStatsHook.playerStats.crystalsCollected,
                    consecutiveCorrect: 0,
                    score: gameStateHook.gameState.score
                });
            }
        } catch (error) {
            console.error('Failed to process answer:', error);
            // Continue with local state even if Convex fails
        }

        setTimeout(async () => {
            mechanicsHook.setBonusState(false); // Reset bonus flag after showing feedback

            // Check if health is 0 or below before continuing
            if (playerStatsHook.playerStats.health <= 0) {
                mechanicsHook.setGameOverState(true);
                gameStateHook.completeGame();
                try {
                    await endGame('health_depleted');
                } catch (error) {
                    console.error('Failed to end game:', error);
                }
                return;
            }

            await handleQuestionTransition();
        }, 2000);
    };

    const handleTimeUp = async (): Promise<void> => {
        if (gameStateHook.gameState.showFeedback) {
            return; // Prevent multiple time up events
        }

        gameStateHook.showFeedback();
        gameStateHook.stopTimer();

        // Reset consecutive count on time up
        mechanicsHook.resetConsecutive();

        try {
            // Update question statistics in Convex (time up counts as wrong answer)
            await answerQuestion(false);
            playerStatsHook.takeDamage(20);

            // Update progress in Convex
            await updateProgress({
                currentQuestion: gameStateHook.gameState.currentQuestion,
                questionInLevel: questionManager.getQuestionInLevel(gameStateHook.gameState.currentQuestion),
                currentDifficulty: questionManager.getCurrentDifficultyLevel(gameStateHook.gameState.currentQuestion),
                health: playerStatsHook.playerStats.health,
                level: playerStatsHook.playerStats.level,
                experience: playerStatsHook.playerStats.experience,
                crystalsCollected: playerStatsHook.playerStats.crystalsCollected,
                consecutiveCorrect: 0,
                score: gameStateHook.gameState.score
            });
        } catch (error) {
            console.error('Failed to process time up:', error);
            playerStatsHook.takeDamage(20);
        }

        setTimeout(async () => {
            // Check if health is 0 or below before continuing
            if (playerStatsHook.playerStats.health <= 0) {
                mechanicsHook.setGameOverState(true);
                gameStateHook.completeGame();
                try {
                    await endGame('health_depleted');
                } catch (error) {
                    console.error('Failed to end game:', error);
                }
                return;
            }

            await handleQuestionTransition();
        }, 2000);
    };

    const handleQuestionTransition = async (): Promise<void> => {
        // const nextQuestion = gameStateHook.gameState.currentQuestion + 1;
        const isLevelComplete = questionManager.isLevelComplete(gameStateHook.gameState.currentQuestion);
        const isAllComplete = questionManager.isAllQuestionsComplete(gameStateHook.gameState.currentQuestion);

        if (isLevelComplete && !isAllComplete) {
            try {
                // Mark level as completed in Convex
                await completeLevel(questionManager.getCurrentDifficultyLevel(gameStateHook.gameState.currentQuestion));
            } catch (error) {
                console.error('Failed to complete level:', error);
            }
            mechanicsHook.setLevelCompletedState(true);

            // Level completed, but more levels available
            setTimeout(() => {
                mechanicsHook.setLevelCompletedState(false);
                gameStateHook.nextQuestion();
            }, 3000); // Show level completion for 3 seconds
        } else if (!isAllComplete) {
            // Continue to next question
            gameStateHook.nextQuestion();
        } else {
            // All questions completed
            mechanicsHook.setGameOverState(false);
            gameStateHook.completeGame();
            try {
                await endGame('completed');
            } catch (error) {
                console.error('Failed to end game:', error);
            }
        }
    };

    const claimRewards = async (): Promise<void> => {
        gameStateHook.showRewards();

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
                alert(`🎉 Rewards claimed!\n💎 ${playerStatsHook.playerStats.crystalsCollected} Crystals\n⭐ ${playerStatsHook.playerStats.experience} XP\n🏆 Level ${playerStatsHook.playerStats.level} NFT minted!`);
                resetGame();
            }, 2000);
        }
    };

    const resetGame = (): void => {
        gameStateHook.resetGameState();
        mechanicsHook.resetMechanics();
        userManagement.clearUserError();
    };

    const handleWalletDisconnect = (): void => {
        wallet.disconnectWallet();
        resetGame();
    };

    return {
        // Wallet
        wallet: wallet.wallet,
        connectWallet: wallet.connectWallet,
        disconnectWallet: handleWalletDisconnect,

        // Game State
        gameState: gameStateHook.gameState,

        // Player Stats
        playerStats: playerStatsHook.playerStats,

        // Game Mechanics
        consecutiveCorrect: mechanicsHook.consecutiveCorrect,
        isBonus: mechanicsHook.isBonus,
        isGameOver: mechanicsHook.isGameOver,
        levelCompleted: mechanicsHook.levelCompleted,

        // User Management
        user: userManagement.user,
        isUserCreated: userManagement.isUserCreated,
        userCreationError: userManagement.userCreationError,
        isCreatingUser: userManagement.isCreatingUser,
        convexError: userManagement.convexError,
        createUserWithUsername: userManagement.createUserWithUsername,
        clearError: userManagement.clearUserError,

        // Actions
        startGame,
        handleAnswer,
        claimRewards,
        resetGame,

        // Computed values
        currentQuestion: questionManager.getCurrentQuestionInLevel(gameStateHook.gameState.currentQuestion),
        totalNumberOfQuestions: questionManager.totalNumberOfQuestions,
        currentDifficulty: questionManager.getCurrentDifficultyLevel(gameStateHook.gameState.currentQuestion),
        questionInLevel: questionManager.getQuestionInLevel(gameStateHook.gameState.currentQuestion)
    };
};