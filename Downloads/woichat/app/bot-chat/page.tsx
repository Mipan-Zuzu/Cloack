"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function BotChatPage() {
  const [username, setUsername] = useState("")
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: "bot" | "user" }>>([])
  const [userMessage, setUserMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem("woichat_username")
    if (!storedUsername) {
      router.push("/")
      return
    }
    setUsername(storedUsername)

    // Initial bot message
    setMessages([
      {
        id: "1",
        text: `Welcome ${storedUsername}! I'm the Woichat Bot. Let me explain what Woichat is all about.`,
        sender: "bot",
      },
      {
        id: "2",
        text: "Woichat is a web-based chatting platform where you can communicate with anyone online without needing authentication or a phone number. Just pick a username and start chatting!",
        sender: "bot",
      },
      {
        id: "3",
        text: "Here are the key features: Real-time messaging with all connected users, emoji support for fun conversations, ability to save favorite messages, and user profiles showing online status and join time.",
        sender: "bot",
      },
      {
        id: "4",
        text: "We have community guidelines to keep the chat friendly and safe. Be respectful, no spam, no harassment, and keep conversations appropriate.",
        sender: "bot",
      },
    ])
  }, [router])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim()) return

    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      text: userMessage,
      sender: "user" as const,
    }
    setMessages((prev) => [...prev, newUserMessage])
    setUserMessage("")
    setLoading(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "That sounds interesting! Feel free to join the main chat room to discuss this with others.",
        "Great question! You can learn more by joining the chat forum where everyone is connected.",
        "I agree! The community is what makes Woichat special. Ready to join the chat?",
        "Click the button below to enter the main chat room and start connecting with people.",
      ]
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: "bot",
        },
      ])
      setLoading(false)
    }, 800)
  }

  const handleEnterChat = () => {
    router.push("/chat")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Chat with Woichat Bot</h1>
          <p className="text-gray-600 text-sm mt-1">Learn about Woichat before joining the main chat</p>
        </div>

        {/* Chat Container */}
        <Card className="h-96 flex flex-col shadow-lg border-0 mb-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask me anything..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!userMessage.trim() || loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Send
              </Button>
            </form>
          </div>
        </Card>

        {/* Action Button */}
        <Button
          onClick={handleEnterChat}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 h-auto flex items-center justify-center gap-2"
        >
          Enter Main Chat Room
          <ArrowRight size={18} />
        </Button>

        {/* Back Button */}
        <Button variant="outline" onClick={() => router.push("/")} className="w-full mt-2">
          Back to Home
        </Button>
      </div>
    </main>
  )
}
