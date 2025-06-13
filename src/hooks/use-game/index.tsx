import { useEffect } from 'react';
import { useWallet } from './use-wallet';
import { useGameState } from './use-game-state';
import { usePlayerStats } from './use-player-stats';
import { useConvexGame } from '../use-convex-game';
import { useGameMechanics } from './use-game-mechanics';
import { useQuestionManager } from './use-question';
import { useUserManagement } from './use-user';

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
    } = useConvexGame(wallet.wallet.address);

    // Sync local state with Convex user data (only once when user is loaded)
    useEffect(() => {
        if (userManagement.user && gameStateHook.gameState.state === 'menu') {
            // Only sync if we're not currently playing to avoid overriding mid-game state
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
    }, [userManagement.user?.address]); // Only trigger when user changes, not on every update

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
            endGame('health_depleted').catch(console.error);
        }
    }, [playerStatsHook.playerStats.health, gameStateHook.gameState.state]);

    // Enhanced startGame with better validation
    const startGame = async (): Promise<void> => {
        // await userManagement.createUserWithUsername('Player1', true);

        if (!wallet.wallet.isConnected) {
            throw new Error('Wallet must be connected before starting game');
        }

        if (!userManagement.isUserCreated) {
            throw new Error('User must be created before starting game');
        }

        try {
            // Start Convex game session first
            const sessionResult = await startConvexGame();
            console.log('Game session started successfully', sessionResult);

            // Reset all local state
            gameStateHook.startGameState();
            playerStatsHook.resetStats();
            mechanicsHook.resetMechanics();

        } catch (error) {
            console.error('Failed to start game:', error);
            throw new Error('Failed to start game session');
        }
    };

    const handleAnswer = async (answerIndex: number): Promise<void> => {
        if (gameStateHook.gameState.selectedAnswer !== null) {
            return; // Prevent multiple answers
        }

        // Set answer and show feedback immediately
        gameStateHook.setAnswer(answerIndex);

        const currentQuestion = questionManager.getCurrentQuestionInLevel(gameStateHook.gameState.currentQuestion);
        const isCorrect = answerIndex === currentQuestion.correct;
        let bonusAwarded = false;

        // Process answer logic locally first for immediate UI feedback
        if (isCorrect) {
            const newConsecutive = mechanicsHook.incrementConsecutive();

            // Check for consecutive bonus (every 10 correct answers)
            if (newConsecutive % 10 === 0) {
                bonusAwarded = true;
                mechanicsHook.setBonusState(true);
            }

            // Update local state immediately
            gameStateHook.incrementScore();
            playerStatsHook.addExperience(currentQuestion.reward.exp);
            playerStatsHook.addCrystals(currentQuestion.reward.crystals);

            if (bonusAwarded) {
                const healthBonus = mechanicsHook.calculateHealthBonus(playerStatsHook.playerStats.health);
                playerStatsHook.healPlayer(healthBonus);
            }

            const newLevel = questionManager.getCurrentLevel(gameStateHook.gameState.currentQuestion);
            playerStatsHook.updateLevel(newLevel);
        } else {
            // Reset consecutive count on wrong answer
            mechanicsHook.resetConsecutive();
            playerStatsHook.takeDamage(20);
        }

        // Update Convex in background (don't block UI)
        try {
            await answerQuestion(isCorrect);

            // Get current stats for Convex update
            const currentStats = playerStatsHook.playerStats;
            const currentGameState = gameStateHook.gameState;

            await updateProgress({
                currentQuestion: currentGameState.currentQuestion,
                questionInLevel: questionManager.getQuestionInLevel(currentGameState.currentQuestion),
                currentDifficulty: questionManager.getCurrentDifficultyLevel(currentGameState.currentQuestion),
                health: isCorrect ? currentStats.health : Math.max(0, currentStats.health - 20),
                level: isCorrect ? questionManager.getCurrentLevel(currentGameState.currentQuestion) : currentStats.level,
                experience: isCorrect ? currentStats.experience + currentQuestion.reward.exp : currentStats.experience,
                crystalsCollected: isCorrect ? currentStats.crystalsCollected + currentQuestion.reward.crystals : currentStats.crystalsCollected,
                consecutiveCorrect: isCorrect ? mechanicsHook.consecutiveCorrect : 0,
                score: isCorrect ? currentGameState.score + 1 : currentGameState.score
            });
        } catch (error) {
            console.error('Failed to process answer in Convex:', error);
            // Continue with local state even if Convex fails
        }

        // Handle post-answer logic after delay
        setTimeout(async () => {
            mechanicsHook.setBonusState(false); // Reset bonus flag after showing feedback

            // Check if health is 0 or below before continuing
            const currentHealth = playerStatsHook.playerStats.health;
            if (currentHealth <= 0) {
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

        // Process time up locally first
        mechanicsHook.resetConsecutive();
        playerStatsHook.takeDamage(20);

        // Update Convex in background
        try {
            await answerQuestion(false);

            const currentStats = playerStatsHook.playerStats;
            const currentGameState = gameStateHook.gameState;

            await updateProgress({
                currentQuestion: currentGameState.currentQuestion,
                questionInLevel: questionManager.getQuestionInLevel(currentGameState.currentQuestion),
                currentDifficulty: questionManager.getCurrentDifficultyLevel(currentGameState.currentQuestion),
                health: Math.max(0, currentStats.health - 20),
                level: currentStats.level,
                experience: currentStats.experience,
                crystalsCollected: currentStats.crystalsCollected,
                consecutiveCorrect: 0,
                score: currentGameState.score
            });
        } catch (error) {
            console.error('Failed to process time up in Convex:', error);
        }

        setTimeout(async () => {
            // Check if health is 0 or below before continuing
            const currentHealth = playerStatsHook.playerStats.health;
            if (currentHealth <= 0) {
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
        const currentQuestionNum = gameStateHook.gameState.currentQuestion;
        const isLevelComplete = questionManager.isLevelComplete(currentQuestionNum);
        const isAllComplete = questionManager.isAllQuestionsComplete(currentQuestionNum);

        if (isLevelComplete && !isAllComplete) {
            try {
                // Mark level as completed in Convex
                await completeLevel(questionManager.getCurrentDifficultyLevel(currentQuestionNum));
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
                alert(`🎉 Rewards claimed!\n💎 ${rewards?.crystals || playerStatsHook.playerStats.crystalsCollected} Crystals\n⭐ ${rewards?.experience || playerStatsHook.playerStats.experience} XP\n🏆 Level ${rewards?.level || playerStatsHook.playerStats.level} NFT minted!`);
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