"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FormLayout from "@/components/form-layout"

export default function DietPreferencesPage() {
  const router = useRouter()
  const [dietTypes, setDietTypes] = useState({
    lowCarb: false,
    highProtein: false,
    balanced: true,
  })

  const [foodsToAvoid, setFoodsToAvoid] = useState({
    beef: false,
    pork: false,
    seafood: false,
    milk: false,
    soy: false,
    eggs: false,
    sugar: false,
  })

  useEffect(() => {
    // Load any existing data
    const savedData = localStorage.getItem("dietPreferences")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setDietTypes(parsed.dietTypes)
      setFoodsToAvoid(parsed.foodsToAvoid)
    }
  }, [])

  const handleDietTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setDietTypes((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFoodsToAvoidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFoodsToAvoid((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = () => {
    localStorage.setItem(
      "dietPreferences",
      JSON.stringify({
        dietTypes,
        foodsToAvoid,
      }),
    )
    router.push("/steps/summary")
  }

  return (
    <FormLayout
      title="Diet Preferences"
      description="Tell us about your dietary preferences and restrictions"
      prevStep="/steps/goal-preference"
      nextStep="/steps/summary"
      onNext={handleSubmit}
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Diet Types</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="lowCarb"
                  name="lowCarb"
                  type="checkbox"
                  checked={dietTypes.lowCarb}
                  onChange={handleDietTypeChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="lowCarb" className="font-medium text-gray-700">
                  Low Carb
                </label>
                <p className="text-gray-500">Reduced carbohydrate intake with focus on proteins and healthy fats</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="highProtein"
                  name="highProtein"
                  type="checkbox"
                  checked={dietTypes.highProtein}
                  onChange={handleDietTypeChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="highProtein" className="font-medium text-gray-700">
                  High Protein
                </label>
                <p className="text-gray-500">Increased protein intake to support muscle growth and recovery</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="balanced"
                  name="balanced"
                  type="checkbox"
                  checked={dietTypes.balanced}
                  onChange={handleDietTypeChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="balanced" className="font-medium text-gray-700">
                  Balanced
                </label>
                <p className="text-gray-500">Even distribution of macronutrients for overall health</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Foods to Avoid</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(foodsToAvoid).map(([food, avoided]) => (
              <div key={food} className="flex items-center">
                <input
                  id={food}
                  name={food}
                  type="checkbox"
                  checked={avoided}
                  onChange={handleFoodsToAvoidChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={food} className="ml-2 text-sm text-gray-700 capitalize">
                  {food}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormLayout>
  )
}
