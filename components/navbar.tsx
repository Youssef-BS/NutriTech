"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { useRouter } from "next/navigation"
import { Menu, LogOut, LayoutDashboard, ChevronDown, Sun, Moon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onMenuClick?: () => void
  onClassSelect?: (className: string) => void
}

export default function Navbar({ onMenuClick, onClassSelect }: NavbarProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [classesOpen, setClassesOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navigateToDashboard = () => {
    if (user?.role === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/user/interface")
    }
  }

  const handleClassClick = (className: string) => {
    setClassesOpen(false)
    if (onClassSelect) {
      onClassSelect(className)
    }
  }

  return (
    <nav className="bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-sidebar-accent rounded-lg lg:hidden">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">NT</div>
          <span className="font-bold text-lg hidden sm:inline">NutriTech</span>
        </div>
      </div>

      {/* Center Section - Classes Dropdown */}
      <div className="hidden md:flex">
        <DropdownMenu open={classesOpen} onOpenChange={setClassesOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              Classes
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuItem onClick={() => handleClassClick("Aliment")}>Aliments</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleClassClick("ContrainteMédicale")}>
              Contraintes Médicales
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleClassClick("Recette")}>Recettes</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleClassClick("Nutriment")}>Nutriments</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleClassClick("ObjectifPersonnel")}>Objectifs Personnels</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon size={18} className="text-slate-700 dark:text-slate-300" />
          ) : (
            <Sun size={18} className="text-yellow-500" />
          )}
        </Button>

        {user?.role === "admin" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/dashboard")}
            className="gap-2 hidden sm:flex"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm">{user?.name}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              {user?.role === "admin" ? "Admin" : "User"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
