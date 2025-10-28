"use client"

import { Card } from "@/components/ui/card"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const emojis = [
    "😀",
    "😂",
    "😍",
    "🤔",
    "😎",
    "🥳",
    "👍",
    "👏",
    "🙌",
    "💪",
    "🤝",
    "❤️",
    "🔥",
    "⭐",
    "✨",
    "🎉",
    "🎊",
    "🚀",
    "😢",
    "😡",
    "😴",
    "🤮",
    "😱",
    "🤯",
  ]

  return (
    <Card className="p-3 border-0 shadow-lg">
      <div className="grid grid-cols-6 gap-2">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onEmojiSelect(emoji)}
            className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </Card>
  )
}
