"use client"

import { Bot, User } from "lucide-react"

export default function Message({ message }: { message: any }) {
  const isAssistant = message.sender === "assistant"

  const timestamp = message.timestamp || new Date()
  const timeString =
    timestamp instanceof Date
      ? timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })

  return (
    <div className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg ring-2 ring-purple-500/20">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div
        className={`group max-w-xs lg:max-w-md xl:max-w-2xl px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
          isAssistant 
            ? "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700" 
            : "bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white"
        }`}
      >
        <p className={`text-[15px] leading-relaxed whitespace-pre-wrap break-words font-medium ${
          isAssistant ? "text-slate-800 dark:text-slate-100" : "text-white"
        }`}>
          {message.text}
        </p>
        <span className={`text-xs mt-2 block font-medium tracking-wide ${
          isAssistant ? "text-slate-500 dark:text-slate-400" : "text-white/80"
        }`}>
          {timeString}
        </span>
      </div>
      {!isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-blue-500/20">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  )
}
