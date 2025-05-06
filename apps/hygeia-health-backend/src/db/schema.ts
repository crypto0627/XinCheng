import {
    sqliteTable,
    text,
    integer,
    real
  } from 'drizzle-orm/sqlite-core'
  import { sql } from 'drizzle-orm'
  
  // 1. 使用者帳號
  export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // uuid or wallet address
    name: text('name'),
    email: text('email'),
    loginType: text('loginType'),
    createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
  })
  
  export const authenticators = sqliteTable('authenticators', {
    id: text('id').primaryKey(),
    credentialID: text('credentialID').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    userId: text('userId').notNull().references(() => users.id),
    transports: text('transports', { mode: 'json' }).$type<string[]>(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  });

  // 2. 個人健康檔案（身高、體重等）
  export const healthProfiles = sqliteTable('health_profiles', {
    userId: text('user_id').references(() => users.id),
    heightCm: real('height_cm'),
    weightKg: real('weight_kg'),
    goalWeightKg: real('goal_weight_kg'),
    deadlineDate: text('deadline_date'), // ISO string
    exercisePerWeek: integer('exercise_per_week'),
    exerciseLevel: text('exercise_level'), // 'low' | 'medium' | 'high'
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
  })
  
  // 3. 飲食偏好與禁忌
  export const dietaryPreferences = sqliteTable('dietary_preferences', {
    userId: text('user_id').references(() => users.id),
    preferenceType: text('preference_type'), // 'vegan', 'keto', etc.
    excludedFoods: text('excluded_foods'), // comma-separated or JSON string
  })
  
  // 4. 問卷結果（風險承受、價格範圍等）
  export const formResponses = sqliteTable('form_responses', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id),
    budgetRange: text('budget_range'), // 'low' | 'medium' | 'high'
    goalLevel: text('goal_level'), // 'light' | 'medium' | 'intense'
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
  })
  
  // 5. AI 推薦計畫（每週飲食 / 運動表）
  export const weeklyPlans = sqliteTable('weekly_plans', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id),
    weekStart: text('week_start'), // ISO date
    mealPlanJson: text('meal_plan_json'), // JSON string
    workoutPlanJson: text('workout_plan_json'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
  })
  
  // 6. Chatbot 記錄
  export const chatHistories = sqliteTable('chat_histories', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id),
    title: text('title'),
    question: text('question'),
    answer: text('answer'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
  })
  