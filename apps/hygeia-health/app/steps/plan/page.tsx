"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MessageCircle, Loader2, Calendar, FileText, Apple, Bot } from "lucide-react"
import ChatDialog from "@/components/chat-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WeeklyPlan } from "@/types"

export default function PlanPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedPlanData = localStorage.getItem("planData")
        if (storedPlanData) {
          const planData = JSON.parse(storedPlanData)
          
          // Extract JSON from the meal string by finding the first '{' and last '}'
          const mealJsonStr = planData.meal.substring(
            planData.meal.indexOf('{'),
            planData.meal.lastIndexOf('}') + 1
          )
          
          // Extract JSON from the workout string by finding the first '{' and last '}'
          const workoutJsonStr = planData.workout.substring(
            planData.workout.indexOf('{'),
            planData.workout.lastIndexOf('}') + 1
          )
          
          // Parse the extracted JSON strings
          const mealPlan = JSON.parse(mealJsonStr)
          const workoutPlan = JSON.parse(workoutJsonStr)
          
          // Convert the meal plan to the expected format
          const weeklyPlan: WeeklyPlan = {}
          mealPlan.week.forEach((day: any) => {
            weeklyPlan[day.day] = {
              breakfast: day.meals.breakfast.name,
              lunch: day.meals.lunch.name,
              dinner: day.meals.dinner.name,
              snacks: "Healthy snacks as needed",
              workout: workoutPlan.week.find((w: any) => w.day === day.day)?.workouts
                .map((w: any) => `${w.name} (${w.duration})`)
                .join(", ") || ""
            }
          })
          
          setWeeklyPlan(weeklyPlan)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error loading plan:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const generateICalData = (plan: WeeklyPlan) => {
    const events = Object.entries(plan).map(([day, plan]) => {
      const date = new Date()
      date.setDate(date.getDate() + ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day))
      
      return [
        `BEGIN:VEVENT`,
        `DTSTART:${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTEND:${new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `SUMMARY:${plan.breakfast}`,
        `DESCRIPTION:Breakfast: ${plan.breakfast}\\nLunch: ${plan.lunch}\\nDinner: ${plan.dinner}\\nSnacks: ${plan.snacks}\\nWorkout: ${plan.workout}`,
        `END:VEVENT`
      ].join('\n')
    }).join('\n')

    return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Hygeia Health//EN\n${events}\nEND:VCALENDAR`
  }

  const exportToAppleCalendar = () => {
    if (!weeklyPlan) return
    const icalData = generateICalData(weeklyPlan)
    const blob = new Blob([icalData], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'hygeia-health-plan.ics')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToGoogleCalendar = () => {
    if (!weeklyPlan) return
    const baseUrl = 'https://calendar.google.com/calendar/render'
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Hygeia Health Plan',
      details: Object.entries(weeklyPlan)
        .map(([day, plan]) => `${day}:\nBreakfast: ${plan.breakfast}\nLunch: ${plan.lunch}\nDinner: ${plan.dinner}\nSnacks: ${plan.snacks}\nWorkout: ${plan.workout}`)
        .join('\n\n')
    })
    window.open(`${baseUrl}?${params.toString()}`)
  }

  const exportToNotes = () => {
    if (!weeklyPlan) return
    const notesContent = Object.entries(weeklyPlan)
      .map(([day, plan]) => `${day}:\nBreakfast: ${plan.breakfast}\nLunch: ${plan.lunch}\nDinner: ${plan.dinner}\nSnacks: ${plan.snacks}\nWorkout: ${plan.workout}`)
      .join('\n\n')
    
    const blob = new Blob([notesContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'hygeia-health-plan.txt')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading || !weeklyPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Generating your personalized plan...</h2>
          <p className="text-muted-foreground">
            This may take a moment as our AI creates your custom meal and workout plan.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/steps/summary"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Summary
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">Your Personalized Plan</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Based on your goals and preferences, we've created a customized meal and workout plan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(weeklyPlan).map(([day, plan]) => (
          <Card key={day} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <CardTitle className="text-xl">{day}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Breakfast</h3>
                    <p className="text-base">{plan.breakfast}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Lunch</h3>
                    <p className="text-base">{plan.lunch}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Dinner</h3>
                    <p className="text-base">{plan.dinner}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Snacks</h3>
                    <p className="text-base">{plan.snacks}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Workout</h3>
                    <p className="text-base">{plan.workout}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Export Your Plan</h2>
          <p className="text-muted-foreground mt-2">
            Choose your preferred way to save and track your personalized plan
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={exportToAppleCalendar}
            className="w-full sm:w-auto hover:bg-primary/10 transition-colors"
          >
            <Apple className="mr-2 h-5 w-5" />
            <span>Apple Calendar</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={exportToGoogleCalendar}
            className="w-full sm:w-auto hover:bg-primary/10 transition-colors"
          >
            <Calendar className="mr-2 h-5 w-5" />
            <span>Google Calendar</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={exportToNotes}
            className="w-full sm:w-auto hover:bg-primary/10 transition-colors"
          >
            <FileText className="mr-2 h-5 w-5" />
            <span>Notes</span>
          </Button>
        </div>
      </div>

      <Button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isChatOpen && <ChatDialog onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}
