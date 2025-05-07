"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FormLayout from "@/components/form-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

export default function GoalPreferencePage() {
  const router = useRouter()
  const [selectedIntensity, setSelectedIntensity] = useState<string>("medium")
  const [budgetRange, setBudgetRange] = useState<string>("")

  useEffect(() => {
    // Load any existing data
    const savedData = localStorage.getItem("goalPreference")
    if (savedData) {
      const data = JSON.parse(savedData)
      setSelectedIntensity(data.intensity)
      setBudgetRange(data.budgetRange || "")
    }
  }, [])

  const handleSubmit = () => {
    localStorage.setItem("goalPreference", JSON.stringify({ 
      intensity: selectedIntensity,
      budgetRange: budgetRange 
    }))
    router.push("/steps/diet-preferences")
  }

  const intensityOptions = [
    {
      value: "low",
      title: "Low Intensity",
      description: "Gradual weight loss with minimal lifestyle changes. Ideal for long-term sustainable results.",
      progress: 33,
    },
    {
      value: "medium",
      title: "Medium Intensity",
      description: "Balanced approach with moderate lifestyle adjustments. Good for steady progress.",
      progress: 66,
    },
    {
      value: "high",
      title: "High Intensity",
      description: "Aggressive approach with significant lifestyle changes. Best for quick results.",
      progress: 100,
    },
  ]

  return (
    <FormLayout
      title="Weight Loss Intensity"
      description="Choose your desired weight loss intensity"
      prevStep="/steps/personal-goals"
      nextStep="/steps/diet-preferences"
      onNext={handleSubmit}
    >
      <RadioGroup
        value={selectedIntensity}
        onValueChange={setSelectedIntensity}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {intensityOptions.map((option) => (
          <Card
            key={option.value}
            className={`cursor-pointer transition-all ${
              selectedIntensity === option.value
                ? "border-primary ring-2 ring-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedIntensity(option.value)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{option.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{option.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Intensity</span>
                  <span className="font-medium">{option.progress}%</span>
                </div>
                <Progress value={option.progress} className="h-2" />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-sm">
                  Select this intensity
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      <div className="mt-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budgetRange">Monthly Budget (USD)</Label>
                <Input
                  id="budgetRange"
                  type="text"
                  placeholder="Enter your monthly budget range (e.g., $100-200)"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormLayout>
  )
}
