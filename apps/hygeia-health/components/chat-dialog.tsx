"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send, User, Bot } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatDialogProps {
  onClose: () => void
}

export default function ChatDialog({ onClose }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your AI nutrition and fitness coach. How can I help you with your meal plan or workout routine today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (input.trim() === "") return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        "how many calories":
          "Based on your profile (current weight, height, and activity level), your daily caloric target is around 1,800 calories for steady weight loss. This creates a moderate deficit while ensuring you have enough energy for your workouts.",
        protein:
          "For your goals and exercise frequency, I recommend consuming 1.6-1.8g of protein per kg of body weight daily. This helps preserve muscle mass during weight loss and supports recovery from your workouts.",
        vegetarian:
          "I can adjust your meal plan to be vegetarian. You can replace animal proteins with plant-based options like tofu, tempeh, legumes, and plant-based protein powders while maintaining your protein goals.",
        hungry:
          "If you're feeling hungry between meals, try adding more fiber and protein to your main meals. You can also add healthy snacks like Greek yogurt with berries, a small handful of nuts, or vegetable sticks with hummus.",
        workout:
          "Based on your goal and exercise frequency preference, I recommend 3-4 strength training sessions per week combined with 2-3 moderate cardio sessions. Make sure to include at least one rest day for recovery.",
        water:
          "You should aim for about 2.5-3 liters of water daily. Proper hydration supports your metabolism, helps control hunger, and improves workout performance.",
        "cheat day":
          'Rather than a full "cheat day," I recommend incorporating planned treat meals 1-2 times per week. This approach is more sustainable and less likely to derail your progress.',
        plateau:
          "Weight loss plateaus are normal! Try mixing up your workout routine, reassessing your calorie intake, ensuring adequate sleep, and managing stress. Sometimes a slight increase in calories for 1-2 days can help restart your metabolism.",
      }

      let responseText =
        "I'm happy to help with that! Could you provide more details about your specific question regarding your nutrition or fitness plan?"

      // Check if the user's message contains any keywords
      for (const [keyword, response] of Object.entries(responses)) {
        if (input.toLowerCase().includes(keyword)) {
          responseText = response
          break
        }
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: responseText,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col h-[600px] max-h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">AI Nutrition & Fitness Coach</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex max-w-[80%] ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tl-lg rounded-tr-sm rounded-bl-lg"
                    : "bg-gray-100 text-gray-800 rounded-tr-lg rounded-tl-sm rounded-br-lg"
                } p-3 rounded-lg`}
              >
                <div className="flex-shrink-0 mr-2">
                  {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your meal plan or workout routine..."
              className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full resize-none border-gray-300 rounded-md"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
