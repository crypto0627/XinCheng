import { PromptTemplate } from '@langchain/core/prompts';

export const mealPrompt = PromptTemplate.fromTemplate(`
User profile:
Height: {height} cm
Weight: {weight} kg
Goal weight: {goalWeight} kg
Exercise frequency: {exercisePerWeek} times per week, intensity: {exerciseLevel}
Dietary preference: {preferenceType}
Restricted foods: {excludedFoods}
Please create a 7-day high-protein low-carb meal plan with three meals per day, output as JSON.
Format requirements:
{{
  "week": [
    {{
      "day": "Monday",
      "meals": {{
        "breakfast": {{ "name": "Meal name", "ingredients": ["Ingredient1", "Ingredient2"], "calories": number }},
        "lunch": {{ "name": "Meal name", "ingredients": ["Ingredient1", "Ingredient2"], "calories": number }},
        "dinner": {{ "name": "Meal name", "ingredients": ["Ingredient1", "Ingredient2"], "calories": number }}
      }}
    }}
    // ... other days
  ]
}}
`);