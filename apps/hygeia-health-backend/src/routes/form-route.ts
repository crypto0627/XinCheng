import { Context, Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../db';
import { healthProfiles, dietaryPreferences, formResponses, weeklyPlans } from '../db/schema';
import { apiKeyAuth, jwtAuthMiddleware } from '../middleware/auth';
import { eq } from 'drizzle-orm';
import { runLangGraphPlanner } from '../lib/ai-agents/plan';

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post('/submit-form',apiKeyAuth, jwtAuthMiddleware, async (c: Context<{ Bindings: CloudflareBindings }>) => {
    const db = getDB(c);
    const body = await c.req.json();
    const userId = c.get('jwtPayload').userId;
  
    // 1. 檢查並更新/插入 health_profiles
    const pg = body.personalGoals;
    const [existingHealthProfile] = await db.select().from(healthProfiles).where(eq(healthProfiles.userId, userId));

    if (existingHealthProfile) {
      await db.update(healthProfiles)
        .set({
          heightCm: Number(pg.height),
          weightKg: Number(pg.currentWeight),
          goalWeightKg: Number(pg.currentWeight) - Number(pg.weightLossGoal),
          deadlineDate: pg.planDeadline,
          exercisePerWeek: Number(pg.exerciseFrequency),
          exerciseLevel: pg.exerciseIntensity,
        })
        .where(eq(healthProfiles.userId, userId));
    } else {
      await db.insert(healthProfiles).values({
        userId,
        heightCm: Number(pg.height),
        weightKg: Number(pg.currentWeight),
        goalWeightKg: Number(pg.currentWeight) - Number(pg.weightLossGoal),
        deadlineDate: pg.planDeadline,
        exercisePerWeek: Number(pg.exerciseFrequency),
        exerciseLevel: pg.exerciseIntensity,
      });
    }
  
    // 2. 檢查並更新/插入 dietary_preferences
    const dp = body.dietPreferences;
    const dietType = Object.entries(dp.dietTypes).filter(([_, v]) => v).map(([k]) => k).join(',');
    const excluded = Object.entries(dp.foodsToAvoid).filter(([_, v]) => v).map(([k]) => k).concat(dp.otherFoods).join(',');
  
    const [existingDietaryPreference] = await db.select().from(dietaryPreferences).where(eq(dietaryPreferences.userId, userId));

    if (existingDietaryPreference) {
      await db.update(dietaryPreferences)
        .set({
          preferenceType: dietType,
          excludedFoods: excluded,
        })
        .where(eq(dietaryPreferences.userId, userId));
    } else {
      await db.insert(dietaryPreferences).values({
        userId,
        preferenceType: dietType,
        excludedFoods: excluded,
      });
    }
  
    // 3. 檢查並更新/插入 form_responses
    const gp = body.goalPreference;
    const [existingFormResponse] = await db.select().from(formResponses).where(eq(formResponses.userId, userId));

    if (existingFormResponse) {
      await db.update(formResponses)
        .set({
          budgetRange: gp.budgetRange,
          goalLevel: gp.intensity,
        })
        .where(eq(formResponses.userId, userId));
    } else {
      await db.insert(formResponses).values({
        id: uuidv4(),
        userId,
        budgetRange: gp.budgetRange,
        goalLevel: gp.intensity,
      });
    }
  
    // 4. 呼叫 LangGraph 產生推薦計畫
    const plan = await runLangGraphPlanner({ userId, context: c });
    
    // 5. 存入 weekly_plans
    await db.insert(weeklyPlans).values({
      id: uuidv4(),
      userId,
      weekStart: new Date().toISOString().slice(0, 10),
      mealPlanJson: JSON.stringify(plan.meal),
      workoutPlanJson: JSON.stringify(plan.workout),
    });
  
    return c.json({ success: true, plan });
  });

export default router;