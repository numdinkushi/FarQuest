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
        setIsLoading(true);
        setError(null);
        try {
            const userId = await createUser({ username, address, isOG });
            console.log('User created with ID:', userId);
            return userId;
        } catch (err) {
            console.log('Error creating user:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [createUser]);

    // Start new game session
    const handleStartGame = useCallback(async () => {
        if (!user) {
            setError('User not found');
            return null;
        }

        setIsLoading(true);
        setError(null);
        try {
            const sessionId = await startGameSession({ userId: user._id });
            setCurrentSessionId(sessionId);
            return sessionId;
        } catch (err) {
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
        if (!user) return;

        try {
            await updateGameProgress({
                userId: user._id,
                ...progressData
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update progress';
            setError(errorMessage);
        }
    }, [user, updateGameProgress]);

    // Update question statistics
    const handleQuestionAnswer = useCallback(async (isCorrect: boolean) => {
        if (!user) return;

        try {
            await updateQuestionStats({
                userId: user._id,
                isCorrect
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update question stats';
            setError(errorMessage);
        }
    }, [user, updateQuestionStats]);

    // Complete difficulty level
    const handleCompleteLevel = useCallback(async (difficulty: string) => {
        if (!user) return;

        try {
            await completeDifficultyLevel({
                userId: user._id,
                difficulty
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to complete level';
            setError(errorMessage);
        }
    }, [user, completeDifficultyLevel]);

    // End game session
    const handleEndGame = useCallback(async (endReason: string) => {
        if (!user || !currentSessionId) return;

        try {
            await endGameSession({
                sessionId: currentSessionId,
                userId: user._id,
                endReason
            });
            setCurrentSessionId(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to end game';
            setError(errorMessage);
        }
    }, [user, currentSessionId, endGameSession]);

    // Claim rewards
    const handleClaimRewards = useCallback(async () => {
        if (!user) return null;

        setIsLoading(true);
        setError(null);
        try {
            const rewards = await claimRewards({ userId: user._id });
            return rewards;
        } catch (err) {
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
    const checkUsername = useMutation(api.queries.isUsernameAvailable);

    const validateUsername = useCallback(async (username: string) => {
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
            const isAvailable = await checkUsername({ username });
            if (!isAvailable) {
                return { isValid: false, message: 'Username is already taken' };
            }
            return { isValid: true, message: 'Username is available' };
        } catch (err) {
            console.log('Error checking username availability:', err);
            return { isValid: false, message: 'Error checking username availability' };
        } finally {
            setIsCheckingUsername(false);
        }
    }, [checkUsername]);

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