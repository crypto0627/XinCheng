"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FormLayout from "@/components/form-layout"

interface PersonalGoals {
  currentWeight: string
  height: string
  weightLossGoal: string
  planDeadline: string
  exerciseFrequency: string
  exerciseIntensity: string
}

interface GoalPreference {
  intensity: string
}

interface DietPreferences {
  dietTypes: {
    lowCarb: boolean
    highProtein: boolean
    balanced: boolean
  }
  foodsToAvoid: {
    beef: boolean
    pork: boolean
    seafood: boolean
    milk: boolean
    soy: boolean
    eggs: boolean
    sugar: boolean
  }
}

export default function SummaryPage() {
  const router = useRouter()
  const [personalGoals, setPersonalGoals] = useState<PersonalGoals | null>(null)
  const [goalPreference, setGoalPreference] = useState<GoalPreference | null>(null)
  const [dietPreferences, setDietPreferences] = useState<DietPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load data from localStorage
    const personalGoalsData = localStorage.getItem("personalGoals")
    const goalPreferenceData = localStorage.getItem("goalPreference")
    const dietPreferencesData = localStorage.getItem("dietPreferences")

    if (personalGoalsData) setPersonalGoals(JSON.parse(personalGoalsData))
    if (goalPreferenceData) setGoalPreference(JSON.parse(goalPreferenceData))
    if (dietPreferencesData) setDietPreferences(JSON.parse(dietPreferencesData))
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      // Combine all data
      const formData = {
        personalGoals,
        goalPreference,
        dietPreferences,
      }

      // In a real app, you would send this to your API
      // const response = await fetch('/api/generate-plan', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // For demo purposes, we'll just store the data and navigate
      localStorage.setItem("allFormData", JSON.stringify(formData))

      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false)
        router.push("/steps/plan")
      }, 1000)
    } catch (error) {
      console.error("Error generating plan:", error)
      setIsLoading(false)
    }
  }

  if (!personalGoals || !goalPreference || !dietPreferences) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading your data...</p>
      </div>
    )
  }

  const selectedDietTypes = Object.entries(dietPreferences.dietTypes)
    .filter(([_, selected]) => selected)
    .map(([type]) => type)

  const selectedFoodsToAvoid = Object.entries(dietPreferences.foodsToAvoid)
    .filter(([_, avoided]) => avoided)
    .map(([food]) => food)

  return (
    <FormLayout
      title="Review Your Plan"
      description="Review your information before generating your personalized plan"
      prevStep="/steps/diet-preferences"
      nextStep="/steps/plan"
      nextButtonText={isLoading ? "Generating..." : "Generate Plan"}
      onNext={handleSubmit}
      isLastStep={true}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Personal Goals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Current Weight</p>
              <p className="font-medium">{personalGoals.currentWeight} kg</p>
            </div>
            <div>
              <p className="text-gray-500">Height</p>
              <p className="font-medium">{personalGoals.height} cm</p>
            </div>
            <div>
              <p className="text-gray-500">Weight Loss Goal</p>
              <p className="font-medium">{personalGoals.weightLossGoal} kg</p>
            </div>
            <div>
              <p className="text-gray-500">Plan Deadline</p>
              <p className="font-medium">{personalGoals.planDeadline}</p>
            </div>
            <div>
              <p className="text-gray-500">Exercise Frequency</p>
              <p className="font-medium">{personalGoals.exerciseFrequency} times per week</p>
            </div>
            <div>
              <p className="text-gray-500">Exercise Intensity</p>
              <p className="font-medium capitalize">{personalGoals.exerciseIntensity}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Weight Loss Intensity</h3>
          <p className="font-medium capitalize">{goalPreference.intensity}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Diet Preferences</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Diet Types</p>
              <p className="font-medium capitalize">
                {selectedDietTypes.length > 0
                  ? selectedDietTypes.map((type) => type.replace(/([A-Z])/g, " $1").trim()).join(", ")
                  : "No specific diet type selected"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Foods to Avoid</p>
              <p className="font-medium capitalize">
                {selectedFoodsToAvoid.length > 0 ? selectedFoodsToAvoid.join(", ") : "No foods to avoid selected"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormLayout>
  )
}
