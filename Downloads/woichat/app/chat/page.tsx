"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, LogOut } from "lucide-react"
import UserProfileCard from "@/components/user-profile-card"
import EmojiPicker from "@/components/emoji-picker"

interface Message {
  id: string
  username: string
  text: string
  timestamp: string
  isFavorite?: boolean
  userId: string
}

interface User {
  username: string
  joinedAt: string
  lastSeen: string
  isOnline: boolean
}

export default function ChatPage() {
  const [username, setUsername] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [userMessage, setUserMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [userId] = useState(() => Math.random().toString(36).substring(7))
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pollIntervalRef = useRef<NodeJS.Timeout>()
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const previousMessageCountRef = useRef(0)
  const previousUsersCountRef = useRef(0)

  useEffect(() => {
    const storedUsername = localStorage.getItem("woichat_username")
    if (!storedUsername) {
      router.push("/")
      return
    }
    setUsername(storedUsername)

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("woichat_favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // Join chat
    const joinChat = async () => {
      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "join",
            username: storedUsername,
            userId,
            joinedAt: localStorage.getItem("woichat_joined_at"),
          }),
        })
        const data = await response.json()
        const messagesWithFavorites = data.messages.map((msg: any) => ({
          ...msg,
          isFavorite: favorites.includes(msg.id),
        }))
        setMessages(messagesWithFavorites)
        previousMessageCountRef.current = messagesWithFavorites.length
        setOnlineUsers(data.users.map((user: any) => ({ ...user, isOnline: true })))
        previousUsersCountRef.current = data.users.length
        setIsConnected(true)
      } catch (error) {
        console.error("[v0] Error joining chat:", error)
      }
    }

    joinChat()

    pollIntervalRef.current = setInterval(async () => {
      try {
        const [messagesRes, usersRes] = await Promise.all([
          fetch("/api/messages?action=messages"),
          fetch("/api/messages?action=users"),
        ])
        const messagesData = await messagesRes.json()
        const usersData = await usersRes.json()

        if (messagesData.messages.length !== previousMessageCountRef.current) {
          const updatedMessages = messagesData.messages.map((msg: any) => ({
            ...msg,
            isFavorite: favorites.includes(msg.id),
          }))
          setMessages(updatedMessages)
          previousMessageCountRef.current = messagesData.messages.length
        }

        if (usersData.users.length !== previousUsersCountRef.current) {
          setOnlineUsers(usersData.users.map((user: any) => ({ ...user, isOnline: true })))
          previousUsersCountRef.current = usersData.users.length
        }
      } catch (error) {
        console.error("[v0] Error polling:", error)
      }
    }, 2000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      // Leave chat
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "leave",
          userId,
        }),
      })
    }
  }, [router, userId, favorites])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim() || !isConnected) return

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "message",
          username,
          text: userMessage,
          userId,
        }),
      })
      const data = await response.json()
      setUserMessage("")
      setShowEmojiPicker(false)
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  const handleTyping = () => {
    setIsTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 2000)
  }

  const toggleFavorite = (messageId: string) => {
    const newFavorites = favorites.includes(messageId)
      ? favorites.filter((id) => id !== messageId)
      : [...favorites, messageId]

    setFavorites(newFavorites)
    localStorage.setItem("woichat_favorites", JSON.stringify(newFavorites))

    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isFavorite: !msg.isFavorite } : msg)))
  }

  const addEmoji = (emoji: string) => {
    setUserMessage((prev) => prev + emoji)
  }

  const handleLogout = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    localStorage.removeItem("woichat_username")
    localStorage.removeItem("woichat_joined_at")
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar - Online Users */}
        <div className="lg:col-span-1">
          <Card className="p-4 shadow-lg border-0 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Online Users</h3>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {onlineUsers.length} online
              </span>
            </div>
            <div className="space-y-2">
              {onlineUsers.map((user, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                    selectedUser?.username === user.username ? "bg-purple-100 shadow-md" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${user.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 truncate">{user.username}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-4">{user.isOnline ? "Online now" : "Offline"}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-screen lg:h-auto flex flex-col shadow-lg border-0">
            {/* Header */}
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">Woichat Forum</h2>
                <p className={`text-xs ${isConnected ? "text-green-600" : "text-red-600"}`}>
                  {isConnected ? "✓ Connected" : "✗ Disconnected"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={18} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={() => setSelectedUser(onlineUsers.find((u) => u.username === msg.username) || null)}
                        className="text-xs font-semibold text-purple-600 hover:underline transition-colors"
                      >
                        {msg.username}
                      </button>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-gray-900 mt-1">{msg.text}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Heart
                        size={16}
                        className={`transition-all duration-200 ${
                          msg.isFavorite
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-gray-400 hover:text-red-500 hover:scale-110"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 items-center text-xs text-gray-500">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>Someone is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={userMessage}
                    onChange={(e) => {
                      setUserMessage(e.target.value)
                      handleTyping()
                    }}
                    className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-purple-400"
                    disabled={!isConnected}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    disabled={!isConnected}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    😊
                  </Button>
                  <Button
                    type="submit"
                    disabled={!userMessage.trim() || !isConnected}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                  >
                    Send
                  </Button>
                </div>
                {showEmojiPicker && <EmojiPicker onEmojiSelect={addEmoji} />}
              </form>
            </div>
          </Card>
        </div>

        {/* User Profile Card */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <div>
              <UserProfileCard user={selectedUser} />
            </div>
          ) : (
            <Card className="p-6 shadow-lg border-0 text-center">
              <MessageCircle size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 text-sm">Click on a username to view their profile</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
