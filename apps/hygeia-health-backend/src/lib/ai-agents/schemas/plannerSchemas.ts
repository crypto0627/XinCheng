import { z } from 'zod';
import { Context } from 'hono';

declare global {
  interface CloudflareBindings {
    ANTHROPIC_API_KEY: string;
  }
}

export const PlannerInputSchema = z.object({ 
  userId: z.string(),
  context: z.custom<Context<{ Bindings: CloudflareBindings }>>()
});

export const PlannerOutputSchema = z.object({ 
  meal: z.string(), // JSON string
  workout: z.string() // JSON string
}); 