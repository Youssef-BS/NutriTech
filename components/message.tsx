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

  // Check if message has class data to display as cards
  const hasClassData = message.classData && Array.isArray(message.classData) && message.classData.length > 0

  return (
    <div className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg ring-2 ring-purple-500/20">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div
        className={`group ${hasClassData ? 'max-w-full' : 'max-w-xs lg:max-w-md xl:max-w-2xl'} ${
          isAssistant && !hasClassData
            ? "px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700"
            : !hasClassData
            ? "px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white"
            : ""
        }`}
      >
        {!hasClassData ? (
          <>
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
          </>
        ) : (
          <div className="space-y-3">
            <div className="px-4 py-3 rounded-2xl shadow-lg bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
              <p className="text-[15px] leading-relaxed font-medium text-slate-800 dark:text-slate-100">
                {message.text}
              </p>
              <span className="text-xs mt-2 block font-medium tracking-wide text-slate-500 dark:text-slate-400">
                {timeString}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {message.classData.map((instance: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {instance.name.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {instance.name}
                    </h4>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(instance.properties).map(([propName, propValue]) => (
                      <div key={propName} className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {propName}
                        </span>
                        <span className="text-sm text-slate-900 dark:text-slate-100 font-semibold break-all">
                          {String(propValue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {!isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-blue-500/20">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  )
}
