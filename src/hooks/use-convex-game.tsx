import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export const useConvexGame = (walletAddress?: string) => {
    console.log('useConvexGame hook initialized with walletAddress:', walletAddress);
    const [currentSessionId, setCurrentSessionId] = useState<Id<"gameSessions"> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Queries
    const user = useQuery(api.queries.getUserByAddress,
        walletAddress ? { address: walletAddress } : "skip"
    );
    const userSessions = useQuery(api.queries.getUserSessions,
        user ? { userId: user._id, limit: 5 } : "skip"
    );
    const leaderboard = useQuery(api.queries.getLeaderboard, { limit: 10 });

    // Mutations
    const createUser = useMutation(api.users.createUser);
    const updateGameProgress = useMutation(api.users.updateGameProgress);
    const updateQuestionStats = useMutation(api.users.updateQuestionStats);
    const completeDifficultyLevel = useMutation(api.users.completeDifficultyLevel);
    const startGameSession = useMutation(api.users.startGameSession);
    const endGameSession = useMutation(api.users.endGameSession);
    const claimRewards = useMutation(api.users.claimRewards);

    // Create user when wallet connects
    const handleCreateUser = useCallback(async (username: string, address: string, isOG?: boolean) => {
        console.log('Creating user with:', { username, address, isOG });
        setIsLoading(true);
        setError(null);
        try {
            const userId = await createUser({ username, address, isOG });
            console.log('User created with ID:', userId);
            return userId;
        } catch (err) {
            console.error('Error creating user:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [createUser]);

    // Start new game session
    const handleStartGame = useCallback(async () => {
        console.log('Starting game, user:', user);
        if (!user) {
            const errorMsg = 'User must be created before starting game';
            console.error(errorMsg);
            setError(errorMsg);
            throw new Error(errorMsg);
        }

        setIsLoading(true);
        setError(null);
        try {
            console.log('Starting game session for user ID:', user._id);
            const sessionId = await startGameSession({ userId: user._id });
            console.log('Game session started with ID:', sessionId);
            setCurrentSessionId(sessionId);
            return sessionId;
        } catch (err) {
            console.error('Error starting game:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to start game';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [user, startGameSession]);

    // Update game progress
    const handleUpdateProgress = useCallback(async (progressData: {
        currentQuestion: number;
        questionInLevel: number;
        currentDifficulty: string;
        health: number;
        level: number;
        experience: number;
        crystalsCollected: number;
        consecutiveCorrect: number;
        score: number;
    }) => {
        if (!user) {
            console.warn('Cannot update progress: user not found');
            return;
        }

        try {
            console.log('Updating progress for user:', user._id, progressData);
            await updateGameProgress({
                userId: user._id,
                ...progressData
            });
            console.log('Progress updated successfully');
        } catch (err) {
            console.error('Error updating progress:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to update progress';
            setError(errorMessage);
        }
    }, [user, updateGameProgress]);

    // Update question statistics
    const handleQuestionAnswer = useCallback(async (isCorrect: boolean) => {
        if (!user) {
            console.warn('Cannot update question stats: user not found');
            return;
        }

        try {
            console.log('Updating question stats for user:', user._id, 'isCorrect:', isCorrect);
            await updateQuestionStats({
                userId: user._id,
                isCorrect
            });
            console.log('Question stats updated successfully');
        } catch (err) {
            console.error('Error updating question stats:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to update question stats';
            setError(errorMessage);
        }
    }, [user, updateQuestionStats]);

    // Complete difficulty level
    const handleCompleteLevel = useCallback(async (difficulty: string) => {
        if (!user) {
            console.warn('Cannot complete level: user not found');
            return;
        }

        try {
            console.log('Completing level for user:', user._id, 'difficulty:', difficulty);
            await completeDifficultyLevel({
                userId: user._id,
                difficulty
            });
            console.log('Level completed successfully');
        } catch (err) {
            console.error('Error completing level:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to complete level';
            setError(errorMessage);
        }
    }, [user, completeDifficultyLevel]);

    // End game session
    const handleEndGame = useCallback(async (endReason: string) => {
        if (!user || !currentSessionId) {
            console.warn('Cannot end game: user or session not found', { user: !!user, session: !!currentSessionId });
            return;
        }

        try {
            console.log('Ending game session:', currentSessionId, 'for user:', user._id, 'reason:', endReason);
            await endGameSession({
                sessionId: currentSessionId,
                userId: user._id,
                endReason
            });
            console.log('Game session ended successfully');
            setCurrentSessionId(null);
        } catch (err) {
            console.error('Error ending game:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to end game';
            setError(errorMessage);
        }
    }, [user, currentSessionId, endGameSession]);

    // Claim rewards
    const handleClaimRewards = useCallback(async () => {
        if (!user) {
            console.warn('Cannot claim rewards: user not found');
            return null;
        }

        setIsLoading(true);
        setError(null);
        try {
            console.log('Claiming rewards for user:', user._id);
            const rewards = await claimRewards({ userId: user._id });
            console.log('Rewards claimed successfully:', rewards);
            return rewards;
        } catch (err) {
            console.error('Error claiming rewards:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to claim rewards';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [user, claimRewards]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // Data
        user,
        userSessions,
        leaderboard,
        currentSessionId,

        // States
        isLoading,
        error,

        // Actions
        createUser: handleCreateUser,
        startGame: handleStartGame,
        updateProgress: handleUpdateProgress,
        answerQuestion: handleQuestionAnswer,
        completeLevel: handleCompleteLevel,
        endGame: handleEndGame,
        claimRewards: handleClaimRewards,
        clearError,

        // Computed values
        isUserCreated: !!user,
        hasActiveSessions: !!currentSessionId,
        userStats: user ? {
            totalGames: user.totalGamesPlayed,
            accuracy: user.totalQuestionsAnswered > 0
                ? (user.totalCorrectAnswers / user.totalQuestionsAnswered) * 100
                : 0,
            levelsCompleted: user.levelsCompleted?.length || 0,
            rewardsClaimed: user.totalRewardsClaimed
        } : null
    };
};

// Hook for username validation
export const useUsernameValidation = () => {
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const checkUsernameAvailability = useMutation(api.users.checkUsernameAvailability);

    const validateUsername = useCallback(async (username: string) => {
        console.log('Validating username:', username);
        
        if (!username || username.length < 3) {
            return { isValid: false, message: 'Username must be at least 3 characters long' };
        }

        if (username.length > 20) {
            return { isValid: false, message: 'Username must be less than 20 characters' };
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
        }

        setIsCheckingUsername(true);
        try {
            const isAvailable = await checkUsernameAvailability({ username });
            console.log('Username availability result:', isAvailable);
            if (!isAvailable) {
                return { isValid: false, message: 'Username is already taken' };
            }
            return { isValid: true, message: 'Username is available' };
        } catch (err) {
            console.error('Error checking username availability:', err);
            return { isValid: false, message: 'Error checking username availability' };
        } finally {
            setIsCheckingUsername(false);
        }
    }, [checkUsernameAvailability]);

    return {
        validateUsername,
        isCheckingUsername
    };
};

// Hook for leaderboard and stats
export const useGameStats = () => {
    const globalStats = useQuery(api.queries.getGlobalStats);
    const leaderboard = useQuery(api.queries.getLeaderboard, { limit: 20 });
    const levelLeaderboard = useQuery(api.queries.getLeaderboardByLevel, { limit: 20 });

    return {
        globalStats,
        leaderboard,
        levelLeaderboard,
        isLoading: globalStats === undefined || leaderboard === undefined || levelLeaderboard === undefined
    };
};