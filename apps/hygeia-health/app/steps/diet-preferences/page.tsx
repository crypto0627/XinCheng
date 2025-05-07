"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FormLayout from "@/components/form-layout"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DietPreferencesPage() {
  const router = useRouter()
  const [dietTypes, setDietTypes] = useState({
    lowCarb: false,
    highProtein: false,
    balanced: true,
    other: false,
  })

  const [foodsToAvoid, setFoodsToAvoid] = useState({
    beef: false,
    pork: false,
    seafood: false,
    milk: false,
    soy: false,
    eggs: false,
    sugar: false,
    other: false,
  })

  const [otherFoods, setOtherFoods] = useState("")
  const [otherDietType, setOtherDietType] = useState("")

  useEffect(() => {
    // Load any existing data
    const savedData = localStorage.getItem("dietPreferences")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setDietTypes(parsed.dietTypes)
      setFoodsToAvoid(parsed.foodsToAvoid)
      setOtherFoods(parsed.otherFoods || "")
      setOtherDietType(parsed.otherDietType || "")
    }
  }, [])

  const handleDietTypeChange = (name: string, checked: boolean) => {
    setDietTypes((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFoodsToAvoidChange = (name: string, checked: boolean) => {
    setFoodsToAvoid((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = () => {
    localStorage.setItem(
      "dietPreferences",
      JSON.stringify({
        dietTypes,
        foodsToAvoid,
        otherFoods,
        otherDietType,
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
        <Card>
          <CardHeader>
            <CardTitle>Diet Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="lowCarb"
                  checked={dietTypes.lowCarb}
                  onCheckedChange={(checked) => handleDietTypeChange("lowCarb", checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="lowCarb">Low Carb</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduced carbohydrate intake with focus on proteins and healthy fats
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="highProtein"
                  checked={dietTypes.highProtein}
                  onCheckedChange={(checked) => handleDietTypeChange("highProtein", checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="highProtein">High Protein</Label>
                  <p className="text-sm text-muted-foreground">
                    Increased protein intake to support muscle growth and recovery
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="balanced"
                  checked={dietTypes.balanced}
                  onCheckedChange={(checked) => handleDietTypeChange("balanced", checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="balanced">Balanced</Label>
                  <p className="text-sm text-muted-foreground">
                    Even distribution of macronutrients for overall health
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="otherDiet"
                  checked={dietTypes.other}
                  onCheckedChange={(checked) => handleDietTypeChange("other", checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="otherDiet">Other</Label>
                  <p className="text-sm text-muted-foreground">Specify your own diet type</p>
                </div>
              </div>
              {dietTypes.other && (
                <div className="ml-6">
                  <Input
                    value={otherDietType}
                    onChange={(e) => setOtherDietType(e.target.value)}
                    placeholder="Please specify your diet type"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foods to Avoid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(foodsToAvoid)
                .filter(([food]) => food !== "other")
                .map(([food, avoided]) => (
                  <div key={food} className="flex items-center space-x-2">
                    <Checkbox
                      id={food}
                      checked={avoided}
                      onCheckedChange={(checked) => handleFoodsToAvoidChange(food, checked as boolean)}
                    />
                    <Label htmlFor={food} className="capitalize">
                      {food}
                    </Label>
                  </div>
                ))}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="otherFood"
                  checked={foodsToAvoid.other}
                  onCheckedChange={(checked) => handleFoodsToAvoidChange("other", checked as boolean)}
                />
                <Label htmlFor="otherFood">Other</Label>
              </div>
              {foodsToAvoid.other && (
                <div className="col-span-2 sm:col-span-3">
                  <Input
                    value={otherFoods}
                    onChange={(e) => setOtherFoods(e.target.value)}
                    placeholder="Please specify other foods to avoid"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FormLayout>
  )
}
