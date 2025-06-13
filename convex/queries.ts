import { query } from "./_generated/server";
import { v } from "convex/values";

// Get user by wallet address
export const getUserByAddress = query({
    args: { address: v.string() },
    handler: async (ctx, args) => {
        console.log("Getting user by address:", args.address);
        
        const user = await ctx.db
            .query("users")
            .withIndex("by_address", (q) => q.eq("address", args.address))
            .first();
        
        console.log("User found:", user ? user._id : "none");
        return user;
    },
});

// Get user by ID
export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        console.log("Getting user by ID:", args.userId);
        
        const user = await ctx.db.get(args.userId);
        console.log("User found:", user ? "yes" : "no");
        return user;
    },
});

// Get leaderboard (top players by score)
export const getLeaderboard = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        console.log("Getting leaderboard with limit:", limit);
        
        const leaderboard = await ctx.db
            .query("users")
            .withIndex("by_score", (q) => q.order("desc"))
            .take(limit);
        
        console.log("Leaderboard entries found:", leaderboard.length);
        return leaderboard;
    },
});

// Get leaderboard by level
export const getLeaderboardByLevel = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        console.log("Getting level leaderboard with limit:", limit);
        
        const leaderboard = await ctx.db
            .query("users")
            .withIndex("by_level", (q) => q.order("desc"))
            .take(limit);
        
        console.log("Level leaderboard entries found:", leaderboard.length);
        return leaderboard;
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
        console.log("Getting user sessions for:", args.userId, "with limit:", limit);
        
        const sessions = await ctx.db
            .query("gameSessions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(limit);
        
        console.log("User sessions found:", sessions.length);
        return sessions;
    },
});

// Get global game statistics
export const getGlobalStats = query({
    handler: async (ctx) => {
        console.log("Getting global stats");
        
        const users = await ctx.db.query("users").collect();
        const sessions = await ctx.db.query("gameSessions").collect();

        const totalUsers = users.length;
        const totalSessions = sessions.length;
        const totalQuestionsAnswered = users.reduce((sum, user) => sum + user.totalQuestionsAnswered, 0);
        const totalCorrectAnswers = users.reduce((sum, user) => sum + user.totalCorrectAnswers, 0);
        const totalCrystalsCollected = users.reduce((sum, user) => sum + user.crystalsCollected, 0);
        const totalExperienceGained = users.reduce((sum, user) => sum + user.experience, 0);

        const stats = {
            totalUsers,
            totalSessions,
            totalQuestionsAnswered,
            totalCorrectAnswers,
            totalCrystalsCollected,
            totalExperienceGained,
            averageScore: totalUsers > 0 ? users.reduce((sum, user) => sum + user.score, 0) / totalUsers : 0,
            accuracyRate: totalQuestionsAnswered > 0 ? (totalCorrectAnswers / totalQuestionsAnswered) * 100 : 0,
        };

        console.log("Global stats calculated:", stats);
        return stats;
    },
});

// Get users by difficulty level
export const getUsersByDifficulty = query({
    args: { difficulty: v.string() },
    handler: async (ctx, args) => {
        console.log("Getting users by difficulty:", args.difficulty);
        
        const users = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("currentDifficulty"), args.difficulty))
            .order("desc")
            .collect();
        
        console.log("Users found for difficulty:", users.length);
        return users;
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
        console.log("Getting top performers for difficulty:", args.difficulty, "with limit:", limit);
        
        const performers = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("highestDifficultyReached"), args.difficulty))
            .order("desc")
            .take(limit);
        
        console.log("Top performers found:", performers.length);
        return performers;
    },
});