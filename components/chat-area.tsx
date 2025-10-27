"use client"

import { useEffect, useRef } from "react"
import { Menu, Bot, Sparkles } from "lucide-react"
import Message from "./message"

type MessageType = any

export default function ChatArea({
  messages,
  sidebarOpen,
  setSidebarOpen,
}: {
  messages: MessageType[]
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

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
      
      {/* Header */}
      <div className="relative border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
              <Bot size={22} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                NutriTech AI
              </h1>
              <Sparkles size={14} className="text-purple-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Online • Ready to assist
            </p>
          </div>
        </div>
        <div className="w-8" />
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <Bot size={48} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles size={20} className="text-purple-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                  Welcome to NutriTech AI
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-lg font-medium leading-relaxed">
                  Your intelligent nutrition companion, ready to help with meal planning, dietary advice, and healthy living tips
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
                {["🥗 Meal Plans", "💪 Nutrition Tips", "🍎 Diet Advice", "📊 Track Progress"].map((tag, i) => (
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
          messages.map((message) => <Message key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
