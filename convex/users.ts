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
        console.log("Creating user with args:", args);
        
        // Check if user already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_address", (q) => q.eq("address", args.address))
            .first();

        if (existingUser) {
            console.log("User already exists:", existingUser._id);
            throw new Error("User already exists with this address");
        }

        // Check if username is taken
        const existingUsername = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();

        if (existingUsername) {
            console.log("Username already taken:", args.username);
            throw new Error("Username is already taken");
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

        console.log("User created successfully with ID:", userId);
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
        console.log("Updating game progress for user:", args.userId);
        
        const user = await ctx.db.get(args.userId);
        if (!user) {
            console.error("User not found:", args.userId);
            throw new Error("User not found");
        }

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

        console.log("Game progress updated successfully");
    },
});

// Update user stats after answering a question
export const updateQuestionStats = mutation({
    args: {
        userId: v.id("users"),
        isCorrect: v.boolean(),
    },
    handler: async (ctx, args) => {
        console.log("Updating question stats for user:", args.userId, "isCorrect:", args.isCorrect);
        
        const user = await ctx.db.get(args.userId);
        if (!user) {
            console.error("User not found:", args.userId);
            throw new Error("User not found");
        }

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

        console.log("Question stats updated successfully");
    },
});

// Mark level as completed
export const completeDifficultyLevel = mutation({
    args: {
        userId: v.id("users"),
        difficulty: v.string(),
    },
    handler: async (ctx, args) => {
        console.log("Completing difficulty level for user:", args.userId, "difficulty:", args.difficulty);
        
        const user = await ctx.db.get(args.userId);
        if (!user) {
            console.error("User not found:", args.userId);
            throw new Error("User not found");
        }

        const levelsCompleted = user.levelsCompleted || [];
        if (!levelsCompleted.includes(args.difficulty)) {
            levelsCompleted.push(args.difficulty);
        }

        await ctx.db.patch(args.userId, {
            levelsCompleted,
            highestDifficultyReached: args.difficulty,
            lastPlayedAt: Date.now(),
        });

        console.log("Difficulty level completed successfully");
    },
});

// Start a new game session
export const startGameSession = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        console.log("Starting game session for user:", args.userId);
        
        const user = await ctx.db.get(args.userId);
        if (!user) {
            console.error("User not found:", args.userId);
            throw new Error("User not found");
        }

        // Get current stats before resetting
        const currentTotalQuestionsAnswered = user.totalQuestionsAnswered;
        const currentTotalCorrectAnswers = user.totalCorrectAnswers;
        const currentTotalWrongAnswers = user.totalWrongAnswers;

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

        console.log("Game session started successfully with ID:", sessionId);
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
        console.log("Ending game session:", args.sessionId, "for user:", args.userId);
        
        const user = await ctx.db.get(args.userId);
        if (!user) {
            console.error("User not found:", args.userId);
            throw new Error("User not found");
        }

        const session = await ctx.db.get(args.sessionId);
        if (!session) {
            console.error("Session not found:", args.sessionId);
            throw new Error("Session not found");
        }

        // Calculate session-specific stats
        const sessionQuestionsAnswered = user.totalQuestionsAnswered - (session.questionsAnswered || 0);
        const sessionCorrectAnswers = user.totalCorrectAnswers - (session.correctAnswers || 0);
        const sessionWrongAnswers = user.totalWrongAnswers - (session.wrongAnswers || 0);

        await ctx.db.patch(args.sessionId, {
            endTime: Date.now(),
            finalScore: user.score,
            questionsAnswered: sessionQuestionsAnswered,
            correctAnswers: sessionCorrectAnswers,
            wrongAnswers: sessionWrongAnswers,
            highestDifficultyReached: user.currentDifficulty,
            crystalsEarned: user.crystalsCollected,
            experienceEarned: user.experience,
            completedSuccessfully: args.endReason === "completed",
            endReason: args.endReason,
        });

        console.log("Game session ended successfully");
    },
});

// Claim rewards
export const claimRewards = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        console.log("Claiming rewards for user:", args.userId);
        
        const user = await ctx.db.get(args.userId);
        if (!user) {
            console.error("User not found:", args.userId);
            throw new Error("User not found");
        }

        await ctx.db.patch(args.userId, {
            totalRewardsClaimed: user.totalRewardsClaimed + 1,
            lastPlayedAt: Date.now(),
        });

        const rewards = {
            crystals: user.crystalsCollected,
            experience: user.experience,
            level: user.level,
        };

        console.log("Rewards claimed successfully:", rewards);
        return rewards;
    },
});

// Check if username is available (MUTATION not query)
export const checkUsernameAvailability = mutation({
    args: {
        username: v.string(),
    },
    handler: async (ctx, args) => {
        console.log("Checking username availability:", args.username);
        
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();

        const isAvailable = !existingUser;
        console.log("Username availability result:", isAvailable);
        return isAvailable;
    },
});