import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new user when they connect their wallet
export const createUser = mutation({
    args: {
        username: v.string(),
        address: v.string(),
        isOG: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("address"), args.address))
            .first();

        if (existingUser) {
            throw new Error("User already exists with this address");
        }

        // Create new user with default game state
        const userId = await ctx.db.insert("users", {
            username: args.username,
            address: args.address,
            score: 0,
            isOG: args.isOG || false,

            // Initial game state
            currentQuestion: 0,
            questionInLevel: 1,
            currentDifficulty: "Starter",
            health: 100,
            level: 1,
            experience: 0,
            crystalsCollected: 0,
            consecutiveCorrect: 0,
            totalQuestionsAnswered: 0,

            // Timestamps
            createdAt: Date.now(),
            lastPlayedAt: Date.now(),

            // Achievement tracking
            levelsCompleted: [],
            highestDifficultyReached: "Starter",

            // Stats
            totalCorrectAnswers: 0,
            totalWrongAnswers: 0,
            totalGamesPlayed: 0,
            totalRewardsClaimed: 0,
        });

        return userId;
    },
});

// Update user's game progress
export const updateGameProgress = mutation({
    args: {
        userId: v.id("users"),
        currentQuestion: v.number(),
        questionInLevel: v.number(),
        currentDifficulty: v.string(),
        health: v.number(),
        level: v.number(),
        experience: v.number(),
        crystalsCollected: v.number(),
        consecutiveCorrect: v.number(),
        score: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            currentQuestion: args.currentQuestion,
            questionInLevel: args.questionInLevel,
            currentDifficulty: args.currentDifficulty,
            health: args.health,
            level: args.level,
            experience: args.experience,
            crystalsCollected: args.crystalsCollected,
            consecutiveCorrect: args.consecutiveCorrect,
            score: args.score,
            lastPlayedAt: Date.now(),
        });
    },
});

// Update user stats after answering a question
export const updateQuestionStats = mutation({
    args: {
        userId: v.id("users"),
        isCorrect: v.boolean(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        await ctx.db.patch(args.userId, {
            totalQuestionsAnswered: user.totalQuestionsAnswered + 1,
            totalCorrectAnswers: args.isCorrect
                ? user.totalCorrectAnswers + 1
                : user.totalCorrectAnswers,
            totalWrongAnswers: !args.isCorrect
                ? user.totalWrongAnswers + 1
                : user.totalWrongAnswers,
            lastPlayedAt: Date.now(),
        });
    },
});

// Mark level as completed
export const completeDifficultyLevel = mutation({
    args: {
        userId: v.id("users"),
        difficulty: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        const levelsCompleted = user.levelsCompleted || [];
        if (!levelsCompleted.includes(args.difficulty)) {
            levelsCompleted.push(args.difficulty);
        }

        await ctx.db.patch(args.userId, {
            levelsCompleted,
            highestDifficultyReached: args.difficulty,
            lastPlayedAt: Date.now(),
        });
    },
});

// Start a new game session
export const startGameSession = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        // Reset user's game state for new session
        await ctx.db.patch(args.userId, {
            currentQuestion: 0,
            questionInLevel: 1,
            currentDifficulty: "Starter",
            health: 100,
            level: 1,
            experience: 0,
            crystalsCollected: 0,
            consecutiveCorrect: 0,
            score: 0,
            totalGamesPlayed: user.totalGamesPlayed + 1,
            lastPlayedAt: Date.now(),
        });

        // Create game session record
        const sessionId = await ctx.db.insert("gameSessions", {
            userId: args.userId,
            startTime: Date.now(),
            finalScore: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            highestDifficultyReached: "Starter",
            crystalsEarned: 0,
            experienceEarned: 0,
            completedSuccessfully: false,
            endReason: "in_progress",
        });

        return sessionId;
    },
});

// End game session
export const endGameSession = mutation({
    args: {
        sessionId: v.id("gameSessions"),
        userId: v.id("users"),
        endReason: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        const session = await ctx.db.get(args.sessionId);
        if (!session) throw new Error("Session not found");

        await ctx.db.patch(args.sessionId, {
            endTime: Date.now(),
            finalScore: user.score,
            questionsAnswered: user.totalQuestionsAnswered - (session.questionsAnswered || 0),
            correctAnswers: user.totalCorrectAnswers - (session.correctAnswers || 0),
            wrongAnswers: user.totalWrongAnswers - (session.wrongAnswers || 0),
            highestDifficultyReached: user.currentDifficulty,
            crystalsEarned: user.crystalsCollected,
            experienceEarned: user.experience,
            completedSuccessfully: args.endReason === "completed",
            endReason: args.endReason,
        });
    },
});

// Claim rewards
export const claimRewards = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        await ctx.db.patch(args.userId, {
            totalRewardsClaimed: user.totalRewardsClaimed + 1,
            lastPlayedAt: Date.now(),
        });

        return {
            crystals: user.crystalsCollected,
            experience: user.experience,
            level: user.level,
        };
    },
});