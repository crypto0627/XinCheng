import { gql } from 'graphql-tag'

export const typeDefs = gql`
  # --- Object Types ---

  type User {
    id: ID!
    name: String
    email: String
    loginType: String
    createdAt: String
    healthProfile: HealthProfile
    dietaryPreferences: [DietaryPreference!]
    formResponses: [FormResponse!]
    weeklyPlans: [WeeklyPlan!]
    chatHistories: [ChatHistory!]
  }

  type HealthProfile {
    userId: ID!
    heightCm: Float
    weightKg: Float
    goalWeightKg: Float
    deadlineDate: String
    exercisePerWeek: Int
    exerciseLevel: String
    createdAt: String
  }

  type DietaryPreference {
    userId: ID!
    preferenceType: String
    excludedFoods: String
  }

  type FormResponse {
    id: ID!
    userId: ID!
    budgetRange: String
    goalLevel: String
    createdAt: String
  }

  type WeeklyPlan {
    id: ID!
    userId: ID!
    weekStart: String
    mealPlanJson: String
    workoutPlanJson: String
    createdAt: String
  }

  type ChatHistory {
    id: ID!
    userId: ID!
    question: String
    answer: String
    createdAt: String
  }

  # --- Queries ---

  type Query {
    getUser(id: ID!): User
    getWeeklyPlan(userId: ID!, weekStart: String!): WeeklyPlan
    getChatHistory(userId: ID!): [ChatHistory!]
  }

  # --- Mutations ---

  type Mutation {
    createUser(input: CreateUserInput!): User
    upsertHealthProfile(input: HealthProfileInput!): HealthProfile
    upsertDietaryPreference(input: DietaryPreferenceInput!): DietaryPreference
    upsertFormResponse(input: FormResponseInput!): FormResponse
    generateWeeklyPlan(userId: ID!): WeeklyPlan
    chatWithCoach(userId: ID!, question: String!): ChatHistory
  }

  # --- Input Types ---

  input CreateUserInput {
    id: ID!
    name: String
    email: String
    loginType: String
  }

  input HealthProfileInput {
    userId: ID!
    heightCm: Float
    weightKg: Float
    goalWeightKg: Float
    deadlineDate: String
    exercisePerWeek: Int
    exerciseLevel: String
  }

  input DietaryPreferenceInput {
    userId: ID!
    preferenceType: String
    excludedFoods: String
  }

  input FormResponseInput {
    id: ID!
    userId: ID!
    budgetRange: String
    goalLevel: String
  }
`
