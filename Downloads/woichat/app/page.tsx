"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function Home() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    // Store username in localStorage
    localStorage.setItem("woichat_username", username)
    localStorage.setItem("woichat_joined_at", new Date().toISOString())

    // Redirect to bot chat page
    router.push("/bot-chat")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Woichat
          </h1>
          <p className="text-gray-600 text-sm">Web Chatting Without Authentication</p>
        </div>

        {/* Main Card */}
        <Card className="p-8 shadow-lg border-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Woichat</h2>
            <p className="text-gray-600 text-sm">
              Chat with anyone, anywhere. No login required. Just pick a username and start chatting!
            </p>
          </div>

          <form onSubmit={handleStartChat} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Choose Your Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                className="w-full"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">{username.length}/20 characters</p>
            </div>

            <Button
              type="submit"
              disabled={!username.trim() || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 h-auto"
            >
              {loading ? "Starting..." : "Start Chatting"}
            </Button>
          </form>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-3">Features:</p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Real-time messaging with everyone online</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 font-bold">•</span>
                <span>Send emojis and express yourself</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Save favorite messages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>View user profiles and online status</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By using Woichat, you agree to our community guidelines
        </p>
      </div>
    </main>
  )
}
