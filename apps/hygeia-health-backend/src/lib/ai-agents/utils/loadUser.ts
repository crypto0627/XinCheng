import { getDB } from '../../../db';
import { healthProfiles, dietaryPreferences, formResponses } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';

export const loadUser = async ({ userId, context }: { userId: string, context: Context<{ Bindings: CloudflareBindings }> }) => {
  const db = getDB(context);
  const [health] = await db.select().from(healthProfiles).where(eq(healthProfiles.userId, userId));
  const [diet] = await db.select().from(dietaryPreferences).where(eq(dietaryPreferences.userId, userId));  
  const [form] = await db.select().from(formResponses).where(eq(formResponses.userId, userId));

  if (!health || !diet || !form) {
    throw new Error(`Missing user data for userId: ${userId}. Health: ${!!health}, Diet: ${!!diet}, Form: ${!!form}`);
  }

  return { userId, context, profile: { health, diet, form } };
}; 