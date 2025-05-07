import { RunnableSequence } from "@langchain/core/runnables";
import { loadUser } from "../utils/loadUser";
import { generateMeal } from "../chains/generateMealChain";
import { generateWorkout } from "../chains/generateWorkoutChain";

export const plannerAgent = RunnableSequence.from([
  loadUser,
  generateMeal,
  generateWorkout
]); 