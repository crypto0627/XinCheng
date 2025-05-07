import { ChatAnthropic } from "@langchain/anthropic";
import { workoutPrompt } from "../prompts/workoutPrompt";

export const generateWorkout = async (input: any) => {
  const { profile, context, meal } = input;
  const health = profile.health;

  const llm = new ChatAnthropic({ 
    modelName: 'claude-3-5-sonnet-20240620', 
    temperature: 0.7, 
    anthropicApiKey: context.env.ANTHROPIC_API_KEY 
  });

  const response = await llm.invoke(await workoutPrompt.format({
    exercisePerWeek: health.exercisePerWeek,
    exerciseLevel: health.exerciseLevel,
    deadlineDate: health.deadlineDate,
    weight: health.weightKg,
    goalWeight: health.goalWeightKg,
  }));

  console.log('Workout response:', response.content);

  return { meal, workout: response.content };
}; 