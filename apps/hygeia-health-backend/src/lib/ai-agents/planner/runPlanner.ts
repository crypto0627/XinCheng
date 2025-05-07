import { PlannerInputSchema, PlannerOutputSchema } from "../schemas/plannerSchemas";
import { plannerAgent } from "../agents/plannerAgent";
import { Context } from "hono";

export const runLangGraphPlanner = async (input: { userId: string, context: Context<{ Bindings: CloudflareBindings }> }) => {
  const parsed = PlannerInputSchema.parse(input);
  const result = await plannerAgent.invoke(parsed);
  return PlannerOutputSchema.parse(result);
}; 