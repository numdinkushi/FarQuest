import { useEffect, useCallback } from 'react';
import { useWallet } from './use-wallet';
import { useGameState } from './use-game-state';
import { usePlayerStats } from './use-player-stats';
import { useConvexGame } from '../use-convex-game';
import { useGameMechanics } from './use-game-mechanics';
import { useQuestionManager } from './use-question';
import { useUserManagement } from './use-user';
import { toast } from 'sonner'; // For error notifications

export const useGameLogic = () => {
    // Initialize all sub-hooks with enhanced wallet support
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

    // Save current game state to Convex
    const saveGameState = useCallback(async (): Promise<void> => {
        if (!userManagement.user || gameStateHook.gameState.state !== 'playing') {
            return; // Nothing to save if not playing or no user
        }

        try {
            console.log('Saving game state before wallet disconnect...');

            const currentStats = playerStatsHook.playerStats;
            const currentGameState = gameStateHook.gameState;

            await updateProgress({
                currentQuestion: currentGameState.currentQuestion,
                questionInLevel: questionManager.getQuestionInLevel(currentGameState.currentQuestion),
                currentDifficulty: questionManager.getCurrentDifficultyLevel(currentGameState.currentQuestion),
                health: currentStats.health,
                level: currentStats.level,
                experience: currentStats.experience,
                crystalsCollected: currentStats.crystalsCollected,
                consecutiveCorrect: mechanicsHook.consecutiveCorrect,
                score: currentGameState.score
            });

            console.log('Game state saved successfully');
        } catch (error) {
            console.error('Failed to save game state:', error);
            // Don't throw - allow disconnect to continue even if save fails
        }
    }, [
        userManagement.user,
        gameStateHook.gameState,
        playerStatsHook.playerStats,
        mechanicsHook.consecutiveCorrect,
        questionManager,
        updateProgress
    ]);

    // Sync local state with Convex user data when user loads or reconnects
    useEffect(() => {
        if (userManagement.user && wallet.wallet.isConnected) {
            console.log('Syncing local state with Convex user data...');

            const user = userManagement.user; // Get the user once to avoid repeated null checks

            // Restore game state from Convex user data
            gameStateHook.setGameState(prev => ({
                ...prev,
                currentQuestion: user.currentQuestion,
                score: user.score,
                // If user was mid-game when they disconnected, restore to playing state
                state: user.currentQuestion > 0 && user.health > 0 ? 'playing' : prev.state
            }));

            playerStatsHook.setPlayerStats({
                health: user.health,
                level: user.level,
                experience: user.experience,
                crystalsCollected: user.crystalsCollected
            });

            mechanicsHook.setConsecutiveCorrect(user.consecutiveCorrect);

            console.log('State synced - User was at question:', user.currentQuestion);
        }
    }, [userManagement.user?.address, wallet.wallet.isConnected]); // Trigger when user changes or wallet connects

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

    // Network validation - show toast if not on correct chain
    useEffect(() => {
        if (wallet.wallet.isConnected && !wallet.isCorrectChain) {
            toast.error("Please switch to Celo Network to play the game");
        }
    }, [wallet.wallet.isConnected, wallet.isCorrectChain]);

    // Enhanced startGame with network validation
    const startGame = async (): Promise<void> => {
        if (!wallet.wallet.isConnected) {
            throw new Error('Wallet must be connected before starting game');
        }

        if (!wallet.isCorrectChain) {
            toast.error("Please switch to Celo Network first");
            return;
        }

        if (!userManagement.isUserCreated) {
            throw new Error('User must be created before starting game');
        }

        try {
            // Check if user has an existing game in progress
            const user = userManagement.user;
            const hasGameInProgress = user &&
                user.currentQuestion > 0 &&
                user.health > 0;

            if (hasGameInProgress) {
                // Resume existing game - state is already synced from useEffect above
                console.log('Resuming game from question:', user.currentQuestion);
                gameStateHook.setGameState(prev => ({ ...prev, state: 'playing' }));
                return;
            }

            // Start new game session
            const sessionResult = await startConvexGame();
            console.log('New game session started successfully', sessionResult);

            // Reset all local state for new game
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

        if (!wallet.isCorrectChain) {
            toast.error("Please switch to Celo Network to continue");
            return;
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
            console.log('Rewards claimed successfully:', rewards);
            // setTimeout(() => {
            //     alert(`🎉 Rewards claimed!\n💎 ${rewards?.crystals || playerStatsHook.playerStats.crystalsCollected} Crystals\n⭐ ${rewards?.experience || playerStatsHook.playerStats.experience} XP\n🏆 Level ${rewards?.level || playerStatsHook.playerStats.level} NFT minted!`);
            //     resetGame();
            // }, 2000);
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

    // Enhanced wallet disconnect that saves state first
    const handleWalletDisconnect = async (): Promise<void> => {
        await wallet.disconnectWallet(saveGameState);
        // Set the game state to 'menu' after disconnecting the wallet
        gameStateHook.setGameState(prev => ({ ...prev, state: 'menu' }));
        userManagement.clearUserError();
    };

    return {
        // Wallet - Enhanced with new features from useWallet
        wallet: wallet.wallet,
        isConnectPending: wallet.isConnectPending,
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
        questionInLevel: questionManager.getQuestionInLevel(gameStateHook.gameState.currentQuestion),

        // Enhanced wallet features from updated useWallet hook
        isSDKLoaded: wallet.isSDKLoaded,
        context: wallet.context,
        showSwitchNetworkBanner: wallet.showSwitchNetworkBanner,
        isCorrectChain: wallet.isCorrectChain,
        switchToTargetChain: wallet.switchToTargetChain,
        isSwitchChainPending: wallet.isSwitchChainPending,
        targetChain: wallet.targetChain
    };
};