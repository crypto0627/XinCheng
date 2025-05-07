import { PromptTemplate } from '@langchain/core/prompts';

export const workoutPrompt = PromptTemplate.fromTemplate(`
The user exercises {exercisePerWeek} times per week with an intensity level of {exerciseLevel}.
The goal is to lose weight from {weight} kg to {goalWeight} kg by {deadlineDate}.
Please design a 7-day workout plan (cardio + strength training) with daily recommendations. Output as JSON.
Format requirements:
{{
  "week": [
    {{
      "day": "Monday",
      "workouts": [
        {{
          "type": "Cardio/Strength Training",
          "name": "Exercise Name",
          "duration": "30 minutes",
          "sets": 3,
          "reps": 12,
          "rest": "60 seconds",
          "calories": 300
        }}
        // ... other exercises
      ]
    }}
    // ... other days
  ]
}}
`);