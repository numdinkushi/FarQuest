import { query } from "./_generated/server";
import { v } from "convex/values";

// Get user by wallet address
export const getUserByAddress = query({
    args: { address: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("address"), args.address))
            .first();
    },
});

// Get user by ID
export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});

// Get leaderboard (top players by score)
export const getLeaderboard = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        return await ctx.db
            .query("users")
            .order("desc")
            .take(limit);
    },
});

// Get leaderboard by level
export const getLeaderboardByLevel = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        return await ctx.db
            .query("users")
            .withIndex("by_level")
            .order("desc")
            .take(limit);
    },
});

// Get user's game sessions
export const getUserSessions = query({
    args: {
        userId: v.id("users"),
        limit: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        return await ctx.db
            .query("gameSessions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(limit);
    },
});

// Get global game statistics
export const getGlobalStats = query({
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        const sessions = await ctx.db.query("gameSessions").collect();

        const totalUsers = users.length;
        const totalSessions = sessions.length;
        const totalQuestionsAnswered = users.reduce((sum, user) => sum + user.totalQuestionsAnswered, 0);
        const totalCorrectAnswers = users.reduce((sum, user) => sum + user.totalCorrectAnswers, 0);
        const totalCrystalsCollected = users.reduce((sum, user) => sum + user.crystalsCollected, 0);
        const totalExperienceGained = users.reduce((sum, user) => sum + user.experience, 0);

        return {
            totalUsers,
            totalSessions,
            totalQuestionsAnswered,
            totalCorrectAnswers,
            totalCrystalsCollected,
            totalExperienceGained,
            averageScore: totalUsers > 0 ? users.reduce((sum, user) => sum + user.score, 0) / totalUsers : 0,
            accuracyRate: totalQuestionsAnswered > 0 ? (totalCorrectAnswers / totalQuestionsAnswered) * 100 : 0,
        };
    },
});

// Get users by difficulty level
export const getUsersByDifficulty = query({
    args: { difficulty: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("currentDifficulty"), args.difficulty))
            .order("desc")
            .collect();
    },
});

// Check if username is available
export const isUsernameAvailable = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();

        return !existingUser;
    },
});

// Get top performers for a specific difficulty
export const getTopPerformersByDifficulty = query({
    args: {
        difficulty: v.string(),
        limit: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        return await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("highestDifficultyReached"), args.difficulty))
            .order("desc")
            .take(limit);
    },
});