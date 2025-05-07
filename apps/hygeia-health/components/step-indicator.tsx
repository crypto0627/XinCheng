"use client"

import { usePathname } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const steps = [
  { name: "Personal Goals", path: "/steps/personal-goals" },
  { name: "Goal Preference", path: "/steps/goal-preference" },
  { name: "Diet Preferences", path: "/steps/diet-preferences" },
  { name: "Summary", path: "/steps/summary" },
  { name: "Your Plan", path: "/steps/plan" },
]

export default function StepIndicator() {
  const pathname = usePathname()
  const currentStepIndex = steps.findIndex((step) => step.path === pathname)
  // 修正進度計算：每個步驟佔據 25% 的進度（5個步驟，4個間隔）
  const progress = currentStepIndex === -1 ? 100 : (currentStepIndex * 25)

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full">
          <div className="relative">
            {/* Energy Bar */}
            <div className="h-3 sm:h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 transition-all duration-500 ease-in-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* 添加光澤效果 */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                {/* 添加脈動效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
            
            {/* Step Indicators */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-all duration-300 shadow-md",
                    index < currentStepIndex
                      ? "border-blue-600 bg-blue-600 scale-110"
                      : index === currentStepIndex
                      ? "border-blue-600 bg-white scale-110 ring-2 sm:ring-4 ring-blue-100"
                      : "border-gray-300 bg-white"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Step Labels */}
          <div className="mt-4 sm:mt-6 flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.name}
                className={cn(
                  "text-[10px] sm:text-xs font-medium transition-colors duration-300 text-center w-12 sm:w-20",
                  index < currentStepIndex
                    ? "text-blue-600"
                    : index === currentStepIndex
                    ? "text-blue-600 font-semibold"
                    : "text-gray-500"
                )}
              >
                <span className="hidden sm:inline">{step.name}</span>
                <span className="sm:hidden">{step.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Display */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-center gap-2 sm:gap-0 min-w-[60px] sm:min-w-[80px]">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {currentStepIndex + 1}/{steps.length}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
            {steps[currentStepIndex]?.name || "Completed"}
          </div>
        </div>
      </div>
    </div>
  )
}
