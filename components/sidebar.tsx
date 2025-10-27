"use client"

import { Menu, Plus, Trash2, LogOut, Settings, MessageSquare, Clock } from "lucide-react"

type Conversation = any
type User = any

export default function Sidebar({
  conversations,
  onNewChat,
  onDeleteConversation,
  onSelectConversation,
  onLogout,
  user,
  sidebarOpen,
  setSidebarOpen,
  onOpenSettings,
}: {
  conversations: Conversation[]
  onNewChat: () => void
  onDeleteConversation: (id: any) => void
  onSelectConversation?: (id: any) => void
  onLogout: () => void
  user: User | null
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onOpenSettings: () => void
}) {
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-secondary lg:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-80 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 z-40 shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Conversations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manage your chats</p>
            </div>
          </div>
          <button
            onClick={onNewChat}
            className="w-full group relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 font-semibold"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus size={20} className="relative" />
            <span className="relative">New Chat</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Clock size={14} />
            <span>Recent</span>
          </div>
          {conversations.map((conv, index) => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation && onSelectConversation(conv.id)}
              className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                conv.active
                  ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/50 border-2 border-transparent"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    conv.active 
                      ? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg" 
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}>
                    <MessageSquare size={18} className={conv.active ? "text-white" : "text-slate-500 dark:text-slate-400"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`block text-sm font-semibold truncate ${
                      conv.active 
                        ? "text-blue-600 dark:text-blue-400" 
                        : "text-slate-800 dark:text-slate-200"
                    }`}>
                      {conv.title}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.active ? "Active conversation" : "Tap to open"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e: any) => {
                    e.stopPropagation()
                    onDeleteConversation(conv.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all text-red-500 hover:text-red-600 hover:scale-110 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
          {/* User Info */}
          {user && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onOpenSettings}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-all duration-200 flex items-center gap-3 font-medium hover:scale-[1.02] group text-slate-700 dark:text-slate-300"
          >
            <Settings size={18} className="text-slate-500 dark:text-slate-400 group-hover:rotate-90 transition-transform duration-300" />
            <span>Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm transition-all duration-200 flex items-center gap-3 text-red-600 dark:text-red-400 font-medium hover:scale-[1.02]"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </>
  )
}
