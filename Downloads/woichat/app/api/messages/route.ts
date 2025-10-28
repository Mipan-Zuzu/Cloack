import { type NextRequest, NextResponse } from "next/server"

// In-memory message storage (in production, use database)
let messages: Array<{
  id: string
  username: string
  text: string
  timestamp: string
  userId: string
}> = []

// In-memory user sessions
const userSessions: Map<
  string,
  {
    username: string
    joinedAt: string
    lastSeen: string
  }
> = new Map()

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action")

  if (action === "messages") {
    return NextResponse.json({ messages })
  }

  if (action === "users") {
    const users = Array.from(userSessions.values())
    return NextResponse.json({ users })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, username, text, userId, joinedAt } = body

  if (type === "join") {
    userSessions.set(userId, {
      username,
      joinedAt,
      lastSeen: new Date().toISOString(),
    })
    return NextResponse.json({
      success: true,
      users: Array.from(userSessions.values()),
      messages,
    })
  }

  if (type === "message") {
    const newMessage = {
      id: Date.now().toString(),
      username,
      text,
      timestamp: new Date().toISOString(),
      userId,
    }
    messages.push(newMessage)

    // Keep only last 100 messages
    if (messages.length > 100) {
      messages = messages.slice(-100)
    }

    return NextResponse.json({ success: true, message: newMessage })
  }

  if (type === "leave") {
    userSessions.delete(userId)
    return NextResponse.json({
      success: true,
      users: Array.from(userSessions.values()),
    })
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 })
}
