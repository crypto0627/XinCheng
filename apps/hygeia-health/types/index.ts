// Personal Goals
export interface PersonalGoals {
  currentWeight: string
  height: string
  weightLossGoal: string
  planDeadline: string
  exerciseFrequency: string
  exerciseIntensity: string
}

// Goal Preference
export interface GoalPreference {
  intensity: string
}

// Diet Types
export interface DietTypes {
  lowCarb: boolean
  highProtein: boolean
  balanced: boolean
  other: boolean
}

// Foods to Avoid
export interface FoodsToAvoid {
  beef: boolean
  pork: boolean
  seafood: boolean
  milk: boolean
  soy: boolean
  eggs: boolean
  sugar: boolean
  other: boolean
}

// Diet Preferences
export interface DietPreferences {
  dietTypes: DietTypes
  foodsToAvoid: FoodsToAvoid
  otherFoods?: string
  otherDietType?: string
}

// Form Data
export interface FormData {
  personalGoals: PersonalGoals
  goalPreference: GoalPreference
  dietPreferences: DietPreferences
}

// Meal Plan
export interface MealPlan {
  breakfast: string
  lunch: string
  dinner: string
  snacks: string
  workout: string
}

// Weekly Plan
export interface WeeklyPlan {
  [key: string]: MealPlan
}

// Brunch Box
export interface BrunchBox {
  id: number
  name: string
  description: string
  price: string
  image: string
}

// Plan Response Data
export interface PlanResponseData {
  weeklyPlan: WeeklyPlan
  brunchBoxes: BrunchBox[]
  recommendations: {
    dailyCalories: number
    proteinIntake: number
    carbIntake: number
    fatIntake: number
    waterIntake: number
  }
  progressTracking: {
    weeklyWeightLossGoal: number
    dailyCalorieDeficit: number
    estimatedCompletionDate: string
  }
}

// API Response
export interface ApiResponse<T> {
  success: boolean
  plan: {
    meal: string
    workout: string
  }
  message?: string
  error?: string
}

// Form Submission Response
export interface FormSubmissionResponse {
  success: boolean
  plan: {
    meal: string
    workout: string
  }
} 