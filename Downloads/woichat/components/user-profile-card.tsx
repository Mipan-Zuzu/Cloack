"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, LogIn } from "lucide-react"

interface User {
  username: string
  joinedAt: Date
  lastSeen: Date
  isOnline: boolean
}

interface UserProfileCardProps {
  user: User
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split("_")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="p-6 shadow-lg border-0 sticky top-4">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
          {getInitials(user.username)}
        </div>
      </div>

      {/* Username */}
      <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{user.username}</h3>

      {/* Status Badge */}
      <div className="flex justify-center mb-4">
        <Badge className={`${user.isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
          {user.isOnline ? "🟢 Online" : "⚫ Offline"}
        </Badge>
      </div>

      {/* Info */}
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <LogIn size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-600 text-xs">Joined</p>
            <p className="text-gray-900 font-medium">{formatDate(user.joinedAt)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock size={16} className="text-pink-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-600 text-xs">Last Seen</p>
            <p className="text-gray-900 font-medium">{formatDate(user.lastSeen)}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-purple-50 rounded-lg p-2">
          <p className="text-xs text-gray-600">Member for</p>
          <p className="text-sm font-bold text-purple-600">
            {Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
        </div>
        <div className="bg-pink-50 rounded-lg p-2">
          <p className="text-xs text-gray-600">Status</p>
          <p className="text-sm font-bold text-pink-600">{user.isOnline ? "Active" : "Away"}</p>
        </div>
      </div>
    </Card>
  )
}
