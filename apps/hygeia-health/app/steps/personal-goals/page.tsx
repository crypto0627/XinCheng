"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FormLayout from "@/components/form-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/stores/auth-store"

export default function PersonalGoalsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentWeight: "",
    height: "",
    weightLossGoal: "",
    planDeadline: "",
    exerciseFrequency: "",
    exerciseIntensity: "medium",
  })
  const { user } = useAuthStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    // Save to localStorage
    localStorage.setItem("personalGoals", JSON.stringify(formData))
    router.push("/steps/goal-preference")
  }

  return (
    <FormLayout
      title={`Hi ${user?.name},`}
      description="Let's start by understanding your current stats and goals"
      prevStep="/"
      nextStep="/steps/goal-preference"
      onNext={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="currentWeight">Current Weight (kg)</Label>
          <Input
            type="number"
            id="currentWeight"
            name="currentWeight"
            value={formData.currentWeight}
            onChange={handleInputChange}
            placeholder="70"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="175"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weightLossGoal">Weight Loss Goal (kg)</Label>
          <Input
            type="number"
            id="weightLossGoal"
            name="weightLossGoal"
            value={formData.weightLossGoal}
            onChange={handleInputChange}
            placeholder="5"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="planDeadline">Plan Deadline</Label>
          <Input
            type="date"
            id="planDeadline"
            name="planDeadline"
            value={formData.planDeadline}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exerciseFrequency">Weekly Exercise Frequency</Label>
          <Select
            value={formData.exerciseFrequency}
            onValueChange={(value) => handleSelectChange("exerciseFrequency", value)}
          >
            <SelectTrigger id="exerciseFrequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 times</SelectItem>
              <SelectItem value="1">1 time</SelectItem>
              <SelectItem value="2">2 times</SelectItem>
              <SelectItem value="3">3 times</SelectItem>
              <SelectItem value="4">4 times</SelectItem>
              <SelectItem value="5">5 times</SelectItem>
              <SelectItem value="6">6 times</SelectItem>
              <SelectItem value="7">7 times</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exerciseIntensity">Exercise Intensity</Label>
          <Select
            value={formData.exerciseIntensity}
            onValueChange={(value) => handleSelectChange("exerciseIntensity", value)}
          >
            <SelectTrigger id="exerciseIntensity">
              <SelectValue placeholder="Select intensity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FormLayout>
  )
}
