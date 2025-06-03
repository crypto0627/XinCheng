import { FormData, FormSubmissionResponse, ApiResponse } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_TEST_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY || ''
}

export const formService = {
  async submitForm(formData: FormData): Promise<ApiResponse<FormSubmissionResponse>> {
    try {
      const response = await fetch(`${API_URL}/api/form/submit-form`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit form')
      }
      
      return response.json()
    } catch (error) {
      throw new Error('Error submitting form: ' + (error as Error).message)
    }
  }
}