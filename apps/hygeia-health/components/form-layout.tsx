"use client"

import type React from "react"

import StepIndicator from "./step-indicator"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface FormLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  prevStep?: string
  nextStep?: string
  nextButtonText?: string
  isLastStep?: boolean
  onNext?: () => void
  warningMessage?: string
}

export default function FormLayout({
  children,
  title,
  description,
  prevStep,
  nextStep,
  nextButtonText = "Next",
  isLastStep = false,
  onNext,
  warningMessage,
}: FormLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <StepIndicator />

      <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-gray-600 mt-2">{description}</p>}
        </div>

        <div className="space-y-6">{children}</div>

        {warningMessage && (
          <p className="text-red-500 text-sm mt-4">{warningMessage}</p>
        )}

        <div className="mt-8 flex justify-between">
          {prevStep ? (
            <Link
              href={prevStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          ) : (
            <div></div>
          )}

          {nextStep ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                if (onNext) {
                  onNext()
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {nextButtonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : isLastStep ? (
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onNext}
            >
              {nextButtonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
