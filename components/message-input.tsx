"use client"

import { useState } from "react"
import { Send, Loader2, Paperclip, Smile } from "lucide-react"

export default function MessageInput({ onSendMessage }: { onSendMessage: (text: string) => void }) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setIsLoading(true)
      onSendMessage(input)
      setInput("")
      setTimeout(() => setIsLoading(false), 600)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="relative border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 md:p-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className={`relative flex gap-3 items-center transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
          <div className="flex-1 relative">
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your message here..."
              className="relative w-full px-5 py-4 pr-24 rounded-2xl bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm focus:shadow-lg font-medium tracking-tight"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                type="button"
                className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <Paperclip size={18} />
              </button>
              <button
                type="button"
                className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <Smile size={18} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="relative group px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 font-semibold overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </span>
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center font-medium">
          Press <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-slate-700 dark:text-slate-300 font-semibold">Enter</kbd> to send or <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-slate-700 dark:text-slate-300 font-semibold">Shift + Enter</kbd> for new line
        </p>
      </form>
    </div>
  )
}
