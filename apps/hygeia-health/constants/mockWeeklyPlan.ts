import { BrunchBox, WeeklyPlan } from "@/types";

export const mockWeeklyPlan: WeeklyPlan = {
    Monday: {
      breakfast: "Oatmeal with berries and nuts (350 cal)",
      lunch: "Grilled chicken salad with olive oil dressing (450 cal)",
      dinner: "Baked salmon with roasted vegetables (550 cal)",
      snacks: "Greek yogurt with honey (150 cal)",
      workout: "30 min cardio + 15 min core exercises",
    },
    Tuesday: {
      breakfast: "Protein smoothie with banana and spinach (300 cal)",
      lunch: "Quinoa bowl with mixed vegetables and tofu (500 cal)",
      dinner: "Turkey breast with sweet potato and green beans (520 cal)",
      snacks: "Apple with almond butter (200 cal)",
      workout: "45 min strength training (upper body)",
    },
    Wednesday: {
      breakfast: "Scrambled eggs with avocado toast (400 cal)",
      lunch: "Lentil soup with whole grain bread (480 cal)",
      dinner: "Grilled lean steak with asparagus and quinoa (600 cal)",
      snacks: "Protein bar (180 cal)",
      workout: "Rest day or light stretching",
    },
    Thursday: {
      breakfast: "Greek yogurt parfait with granola and berries (320 cal)",
      lunch: "Tuna salad wrap with mixed greens (450 cal)",
      dinner: "Baked chicken with brown rice and broccoli (550 cal)",
      snacks: "Handful of mixed nuts (170 cal)",
      workout: "40 min HIIT workout",
    },
    Friday: {
      breakfast: "Whole grain toast with eggs and spinach (380 cal)",
      lunch: "Mediterranean bowl with falafel and hummus (520 cal)",
      dinner: "Grilled fish with roasted sweet potatoes (500 cal)",
      snacks: "Cottage cheese with pineapple (160 cal)",
      workout: "45 min strength training (lower body)",
    },
    Saturday: {
      breakfast: "Protein pancakes with berries (400 cal)",
      lunch: "Chicken and vegetable stir-fry with brown rice (550 cal)",
      dinner: "Lean beef burger with side salad (no bun) (520 cal)",
      snacks: "Protein smoothie (200 cal)",
      workout: "60 min mixed cardio and strength",
    },
    Sunday: {
      breakfast: "Vegetable omelet with whole grain toast (380 cal)",
      lunch: "Grilled shrimp salad with light dressing (420 cal)",
      dinner: "Baked cod with quinoa and roasted vegetables (480 cal)",
      snacks: "Dark chocolate and almonds (150 cal)",
      workout: "Active recovery - 30 min walking or yoga",
    },
  }

export const mockBrunchBoxes: BrunchBox[] = [
    {
      id: 1,
      name: "Protein Power Pack",
      description: "High protein meals to support your workout routine and muscle recovery",
      price: "$89.99/week",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Low-Carb Essentials",
      description: "Carb-controlled meals perfect for your weight loss journey",
      price: "$79.99/week",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Balanced Nutrition Box",
      description: "Well-balanced meals with optimal macronutrient distribution",
      price: "$74.99/week",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]