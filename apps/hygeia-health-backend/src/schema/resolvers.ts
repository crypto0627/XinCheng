import { drizzle } from 'drizzle-orm/d1'
import {
  users,
  healthProfiles,
  dietaryPreferences,
  formResponses,
  weeklyPlans,
  chatHistories,
} from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

// context.env.DB: D1 instance
export const resolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: string }, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      const result = await db.select().from(users).where(eq(users.id, id))
      return result[0] ?? null
    },

    getWeeklyPlan: async (_: any, { userId, weekStart }: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      const result = await db
        .select()
        .from(weeklyPlans)
        .where(and(eq(weeklyPlans.userId, userId), eq(weeklyPlans.weekStart, weekStart)))
      return result[0] ?? null
    },

    getChatHistory: async (_: any, { userId }: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      return db.select().from(chatHistories).where(eq(chatHistories.userId, userId))
    },
  },

  Mutation: {
    createUser: async (_: any, { input }: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      await db.insert(users).values(input).onConflictDoNothing()
      return input
    },

    upsertHealthProfile: async (_: any, { input }: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      await db
        .insert(healthProfiles)
        .values(input)
        .onConflictDoUpdate({
          target: [healthProfiles.userId],
          set: input,
        })
      return input
    },

    upsertDietaryPreference: async (_: any, { input }: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      await db
        .insert(dietaryPreferences)
        .values(input)
        .onConflictDoUpdate({
          target: [dietaryPreferences.userId],
          set: input,
        })
      return input
    },

    upsertFormResponse: async (_: any, { input }: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      await db
        .insert(formResponses)
        .values(input)
        .onConflictDoUpdate({
          target: [formResponses.id],
          set: input,
        })
      return input
    },

    generateWeeklyPlan: async (_: any, { userId }: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)

      const newPlan = {
        id: uuidv4(),
        userId,
        weekStart: new Date().toISOString().slice(0, 10),
        mealPlanJson: JSON.stringify({}), // ← 預留給 AI
        workoutPlanJson: JSON.stringify({}),
      }

      await db.insert(weeklyPlans).values(newPlan)
      return newPlan
    },

    chatWithCoach: async (_: any, { userId, question }: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      const answer = `AI 回覆：根據 ${question} ...` // ← 未來可串 RAG + LLM
      const history = {
        id: uuidv4(),
        userId,
        question,
        answer,
        title: question.slice(0, 20),
      }
      await db.insert(chatHistories).values(history)
      return history
    },
  },

  User: {
    healthProfile: async (parent: any, _: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      const result = await db
        .select()
        .from(healthProfiles)
        .where(eq(healthProfiles.userId, parent.id))
      return result[0] ?? null
    },
    dietaryPreferences: async (parent: any, _: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      return db
        .select()
        .from(dietaryPreferences)
        .where(eq(dietaryPreferences.userId, parent.id))
    },
    formResponses: async (parent: any, _: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      return db
        .select()
        .from(formResponses)
        .where(eq(formResponses.userId, parent.id))
    },
    weeklyPlans: async (parent: any, _: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      return db
        .select()
        .from(weeklyPlans)
        .where(eq(weeklyPlans.userId, parent.id))
    },
    chatHistories: async (parent: any, _: any, ctx: any) => {
      const db = drizzle(ctx.env.DB)
      return db
        .select()
        .from(chatHistories)
        .where(eq(chatHistories.userId, parent.id))
    },
  },
}
