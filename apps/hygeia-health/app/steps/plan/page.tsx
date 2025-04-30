"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MessageCircle } from "lucide-react"
import ChatDialog from "@/components/chat-dialog"

interface MealPlan {
  breakfast: string
  lunch: string
  dinner: string
  snacks: string
  workout: string
}

interface WeeklyPlan {
  [key: string]: MealPlan
}

interface BrunchBox {
  id: number
  name: string
  description: string
  price: string
  image: string
}

export default function PlanPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null)
  const [brunchBoxes, setBrunchBoxes] = useState<BrunchBox[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      try {
        // In a real app, this would be a fetch call to your API
        // const response = await fetch('/api/generate-plan', { ... });
        // const data = await response.json();

        // For demo purposes, we'll use localStorage and generate mock data
        const storedData = localStorage.getItem("allFormData")
        if (storedData) {
          setUserData(JSON.parse(storedData))
        }

        // Simulate API delay
        setTimeout(() => {
          // Generate mock meal plan
          const mockWeeklyPlan: WeeklyPlan = {
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

          // Generate mock brunch boxes
          const mockBrunchBoxes: BrunchBox[] = [
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

          setWeeklyPlan(mockWeeklyPlan)
          setBrunchBoxes(mockBrunchBoxes)
          setIsLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error loading plan:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading || !weeklyPlan) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Generating your personalized plan...</p>
          <p className="text-gray-500 mt-2">
            This may take a moment as our AI creates your custom meal and workout plan.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/steps/summary"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Summary
          </Link>
          <h1 className="text-3xl font-bold mt-2">Your Personalized Plan</h1>
          <p className="text-gray-600 mt-1">
            Based on your goals and preferences, we've created a customized meal and workout plan
          </p>
        </div>
        <button
          onClick={() => setIsChatOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Ask AI Coach
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Your Weekly Meal & Workout Plan</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Day
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Breakfast
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lunch
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dinner
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Snacks
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Workout
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(weeklyPlan).map(([day, plan]) => (
                  <tr key={day}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.breakfast}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.lunch}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.dinner}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.snacks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.workout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Meal Boxes</h2>
          <p className="text-gray-600 mb-6">Based on your preferences, we recommend these meal delivery options</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brunchBoxes.map((box) => (
              <div
                key={box.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img src={box.image || "/placeholder.svg"} alt={box.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-medium text-lg">{box.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{box.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-blue-600 font-medium">{box.price}</span>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isChatOpen && <ChatDialog onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}
