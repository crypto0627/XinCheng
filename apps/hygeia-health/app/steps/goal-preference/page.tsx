"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FormLayout from "@/components/form-layout"

export default function GoalPreferencePage() {
  const router = useRouter()
  const [selectedIntensity, setSelectedIntensity] = useState<string>("medium")

  useEffect(() => {
    // Load any existing data
    const savedData = localStorage.getItem("goalPreference")
    if (savedData) {
      setSelectedIntensity(JSON.parse(savedData).intensity)
    }
  }, [])

  const handleSubmit = () => {
    localStorage.setItem("goalPreference", JSON.stringify({ intensity: selectedIntensity }))
    router.push("/steps/diet-preferences")
  }

  return (
    <FormLayout
      title="Weight Loss Intensity"
      description="Choose your desired weight loss intensity"
      prevStep="/steps/personal-goals"
      nextStep="/steps/diet-preferences"
      onNext={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          className={`border rounded-lg p-6 cursor-pointer transition-all ${
            selectedIntensity === "low"
              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
              : "hover:border-blue-200 hover:bg-blue-50"
          }`}
          onClick={() => setSelectedIntensity("low")}
        >
          <h3 className="text-lg font-medium mb-2">Low Intensity</h3>
          <p className="text-sm text-gray-600">
            Gradual weight loss with minimal lifestyle changes. Ideal for long-term sustainable results.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "33%" }}></div>
            </div>
          </div>
        </div>

        <div
          className={`border rounded-lg p-6 cursor-pointer transition-all ${
            selectedIntensity === "medium"
              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
              : "hover:border-blue-200 hover:bg-blue-50"
          }`}
          onClick={() => setSelectedIntensity("medium")}
        >
          <h3 className="text-lg font-medium mb-2">Medium Intensity</h3>
          <p className="text-sm text-gray-600">
            Balanced approach with moderate lifestyle adjustments. Good for steady progress.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "66%" }}></div>
            </div>
          </div>
        </div>

        <div
          className={`border rounded-lg p-6 cursor-pointer transition-all ${
            selectedIntensity === "high"
              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
              : "hover:border-blue-200 hover:bg-blue-50"
          }`}
          onClick={() => setSelectedIntensity("high")}
        >
          <h3 className="text-lg font-medium mb-2">High Intensity</h3>
          <p className="text-sm text-gray-600">
            Aggressive approach with significant lifestyle changes. Best for quick results.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </FormLayout>
  )
}
