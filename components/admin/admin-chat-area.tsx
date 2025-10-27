"use client"

import { useEffect, useRef } from "react"
import { MessageCircle, User, Shield, Sparkles } from "lucide-react"

export default function AdminChatArea({ messages }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      
      <div className="relative flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <MessageCircle size={48} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles size={20} className="text-purple-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                  Select a User Conversation
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-lg font-medium leading-relaxed">
                  Choose a user from the left panel to view and respond to their messages
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
                {["👥 Users", "💬 Messages", "📊 Analytics", "⚙️ Settings"].map((tag, i) => (
                  <div 
                    key={i} 
                    className="px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:scale-105 transition-transform cursor-pointer shadow-sm"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isAdmin = message.sender === "admin"
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
              <div key={message.id} className={`flex gap-3 ${isAdmin ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                {!isAdmin && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center shadow-lg ring-2 ring-slate-500/20">
                    <User size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`group max-w-xs lg:max-w-md xl:max-w-2xl px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isAdmin
                      ? "bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 text-white"
                      : "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <p className={`text-[15px] leading-relaxed whitespace-pre-wrap break-words font-medium ${
                    !isAdmin ? "text-slate-800 dark:text-slate-100" : "text-white"
                  }`}>
                    {message.text}
                  </p>
                  <span className={`text-xs mt-2 block font-medium tracking-wide ${
                    !isAdmin ? "text-slate-500 dark:text-slate-400" : "text-white/80"
                  }`}>
                    {timeString}
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-blue-500/20">
                    <Shield size={16} className="text-white" />
                  </div>
                )}
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
