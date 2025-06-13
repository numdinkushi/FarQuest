import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        // Required fields
        username: v.string(),
        score: v.number(),
        address: v.string(),

        // Optional fields
        isOG: v.optional(v.boolean()),

        // Game progress fields
        currentQuestion: v.number(),
        questionInLevel: v.number(),
        currentDifficulty: v.string(),
        health: v.number(),
        level: v.number(),
        experience: v.number(),
        crystalsCollected: v.number(),

        // Game state tracking
        consecutiveCorrect: v.number(),
        totalQuestionsAnswered: v.number(),

        // Timestamps
        createdAt: v.number(),
        lastPlayedAt: v.number(),

        // Achievement tracking
        levelsCompleted: v.array(v.string()),
        highestDifficultyReached: v.string(),

        // Stats
        totalCorrectAnswers: v.number(),
        totalWrongAnswers: v.number(),
        totalGamesPlayed: v.number(),
        totalRewardsClaimed: v.number(),
    })
        .index("by_address", ["address"])
        .index("by_score", ["score"])
        .index("by_level", ["level"])
        .index("by_username", ["username"]),

    // Game sessions for detailed tracking
    gameSessions: defineTable({
        userId: v.optional(v.id("users")),
        startTime: v.number(),
        endTime: v.optional(v.number()),
        finalScore: v.number(),
        questionsAnswered: v.number(),
        correctAnswers: v.number(),
        wrongAnswers: v.number(),
        highestDifficultyReached: v.string(),
        crystalsEarned: v.number(),
        experienceEarned: v.number(),
        completedSuccessfully: v.boolean(),
        endReason: v.string(), // "completed", "health_depleted", "quit"
    })
        .index("by_user", ["userId"])
        .index("by_score", ["finalScore"])
        .index("by_start_time", ["startTime"]),
});