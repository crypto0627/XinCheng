import { ChatAnthropic } from "@langchain/anthropic";
import { mealPrompt } from "../prompts/mealPrompt";

export const generateMeal = async (input: any) => {
  const { profile, context } = input;
  if (!profile?.health) throw new Error('Missing health profile');

  const llm = new ChatAnthropic({ 
    modelName: 'claude-3-5-sonnet-20240620', 
    temperature: 0.7, 
    anthropicApiKey: context.env.ANTHROPIC_API_KEY 
  });

  const response = await llm.invoke(await mealPrompt.format({
    height: profile.health.heightCm,
    weight: profile.health.weightKg,
    goalWeight: profile.health.goalWeightKg,
    exercisePerWeek: profile.health.exercisePerWeek,
    exerciseLevel: profile.health.exerciseLevel,
    preferenceType: profile.diet.preferenceType,
    excludedFoods: profile.diet.excludedFoods,
  }));

  console.log('Meal response:', response.content);

  return { ...input, meal: response.content };
}; 