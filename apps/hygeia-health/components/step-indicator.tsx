"use client"

import { usePathname } from "next/navigation"

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

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-2 sm:space-x-4">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="flex items-center">
              {stepIdx < currentStepIndex ? (
                <div className="flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="hidden sm:block ml-2 text-sm font-medium text-gray-900">{step.name}</div>
                </div>
              ) : stepIdx === currentStepIndex ? (
                <div className="flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-blue-600 bg-white text-blue-600">
                    <span className="text-sm font-medium">{stepIdx + 1}</span>
                  </div>
                  <div className="hidden sm:block ml-2 text-sm font-medium text-gray-900">{step.name}</div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-500">
                    <span className="text-sm font-medium">{stepIdx + 1}</span>
                  </div>
                  <div className="hidden sm:block ml-2 text-sm font-medium text-gray-500">{step.name}</div>
                </div>
              )}

              {stepIdx < steps.length - 1 ? (
                <div className="hidden sm:block h-0.5 w-5 sm:w-10 bg-gray-300 ml-2">
                  <span className="sr-only">separator</span>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
