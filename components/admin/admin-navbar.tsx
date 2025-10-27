"use client"

import { Menu, LayoutDashboard, Bell, Settings, Sun, Moon } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"

export default function AdminNavbar({ onMenuClick }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 lg:hidden"
        >
          <Menu size={20} className="text-slate-700 dark:text-slate-300" />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <LayoutDashboard size={22} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nutrition Management System</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon size={20} className="text-slate-700" />
          ) : (
            <Sun size={20} className="text-yellow-500" />
          )}
        </button>
        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 relative">
          <Bell size={20} className="text-slate-700 dark:text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105">
          <Settings size={20} className="text-slate-700 dark:text-slate-300" />
        </button>
        <div className="pl-4 border-l border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}
