"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FormLayout from "@/components/form-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { formService } from "@/services/formService"
import { FormData } from "@/types"

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
    other: boolean
  }
  foodsToAvoid: {
    beef: boolean
    pork: boolean
    seafood: boolean
    milk: boolean
    soy: boolean
    eggs: boolean
    sugar: boolean
    other: boolean
  }
  otherFoods?: string
  otherDietType?: string
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
      // Validate that all required data is present
      if (!personalGoals || !goalPreference || !dietPreferences) {
        throw new Error("Missing required form data")
      }

      // Combine all data with proper typing
      const formData: FormData = {
        personalGoals,
        goalPreference,
        dietPreferences,
      }

      // Submit form data using formService
      const response = await formService.submitForm(formData)
      if (response.success) {
        // Store both form data and response data in localStorage
        localStorage.setItem("allFormData", JSON.stringify(formData))
        localStorage.setItem("planData", JSON.stringify(response.plan))
        router.push("/steps/plan")
      }
    } catch (error) {
      console.error("Error generating plan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!personalGoals || !goalPreference || !dietPreferences) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Generating your personalized plan...</p>
          </div>
        </div>
      )}
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
          <Card>
            <CardHeader>
              <CardTitle>Personal Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Weight</p>
                  <p className="font-medium">{personalGoals.currentWeight} kg</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-medium">{personalGoals.height} cm</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Weight Loss Goal</p>
                  <p className="font-medium">{personalGoals.weightLossGoal} kg</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plan Deadline</p>
                  <p className="font-medium">{personalGoals.planDeadline}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Exercise Frequency</p>
                  <p className="font-medium">{personalGoals.exerciseFrequency} times per week</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Exercise Intensity</p>
                  <p className="font-medium capitalize">{personalGoals.exerciseIntensity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weight Loss Intensity</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-base">
                {goalPreference.intensity.charAt(0).toUpperCase() + goalPreference.intensity.slice(1)} Intensity
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diet Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Diet Types</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDietTypes.length > 0 ? (
                    selectedDietTypes.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type.replace(/([A-Z])/g, " $1").trim()}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No specific diet type selected</Badge>
                  )}
                  {dietPreferences.otherDietType && (
                    <Badge variant="secondary">{dietPreferences.otherDietType}</Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Foods to Avoid</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFoodsToAvoid.length > 0 ? (
                    selectedFoodsToAvoid.map((food) => (
                      <Badge key={food} variant="secondary">
                        {food}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No foods to avoid selected</Badge>
                  )}
                  {dietPreferences.otherFoods && (
                    <Badge variant="secondary">{dietPreferences.otherFoods}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FormLayout>
    </>
  )
}
