"use client"

import {
  Menu,
  LogOut,
  Apple,
  AlertCircle,
  BookOpen,
  Utensils,
  Activity,
  Target,
  Settings as SettingsIcon,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, user, onSelectSubclass }) {
  const [expandedMenu, setExpandedMenu] = useState(null)
  const { logout } = useAuth()
  const router = useRouter()

  const classes = [
    {
      name: "Aliments",
      icon: Apple,
      subclasses: [
        { name: "Cereal", examples: ["Riz", "Blé", "Avoine", "Maïs"] },
        { name: "Fruit", examples: ["Pomme", "Banane", "Orange", "Fraise"] },
        { name: "Legume", examples: ["Carotte", "Brocoli", "Épinard", "Tomate"] },
        { name: "Proteine Animal", examples: ["Poulet", "Boeuf", "Poisson", "Oeuf"] },
        { name: "Proteine Vegetale", examples: ["Lentille", "Pois Chiche", "Tofu", "Tempeh"] },
        { name: "Viande", examples: ["Steak", "Côtelette", "Rôti", "Escalope"] },
      ],
    },
    {
      name: "Contraintes Medicales",
      icon: AlertCircle,
      subclasses: [
        { name: "Allergie au Gluten", examples: ["Blé", "Orge", "Seigle", "Avoine"] },
        { name: "Diabete", examples: ["Sucre raffiné", "Miel", "Sirop", "Bonbons"] },
        { name: "Intolerance au Lactose", examples: ["Lait", "Fromage", "Yaourt", "Beurre"] },
        { name: "Obesite", examples: ["Aliments gras", "Sucres rapides", "Alcool", "Fritures"] },
      ],
    },
    {
      name: "Recettes",
      icon: BookOpen,
      subclasses: [
        { name: "Petit Déjeuner", examples: ["Oeufs brouillés", "Porridge", "Pancakes", "Smoothie"] },
        { name: "Déjeuner", examples: ["Salade César", "Pâtes", "Sandwich", "Riz Poulet"] },
        { name: "Dîner", examples: ["Poisson grillé", "Steak frites", "Pâtes Carbonara", "Curry"] },
        { name: "Snack", examples: ["Fruits secs", "Yaourt", "Noix", "Barre protéinée"] },
      ],
    },
    {
      name: "Nutriments",
      icon: Utensils,
      subclasses: [
        { name: "Protéines", examples: ["Protéine complète", "Acides aminés", "BCAA"] },
        { name: "Glucides", examples: ["Sucres simples", "Sucres complexes", "Fibres"] },
        { name: "Lipides", examples: ["Graisses saturées", "Graisses insaturées", "Oméga-3"] },
        { name: "Vitamines", examples: ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine B12"] },
      ],
    },
    {
      name: "Activite Physique",
      icon: Activity,
      subclasses: [
        { name: "Cardio", examples: ["Course", "Cyclisme", "Natation", "Boxe"] },
        { name: "Musculation", examples: ["Haltères", "Poids du corps", "Machines", "Élastiques"] },
        { name: "Flexibilité", examples: ["Yoga", "Pilates", "Étirements", "Tai Chi"] },
        { name: "Sport", examples: ["Football", "Tennis", "Basketball", "Volleyball"] },
      ],
    },
    {
      name: "Objectif Personnel",
      icon: Target,
      subclasses: [
        { name: "Perte de Poids", examples: ["Déficit calorique", "Cardio régulier", "Alimentation équilibrée"] },
        { name: "Gain Musculaire", examples: ["Surplus calorique", "Musculation", "Protéines élevées"] },
        { name: "Santé Générale", examples: ["Équilibre nutritionnel", "Activité régulière", "Sommeil"] },
        { name: "Performance", examples: ["Entraînement spécifique", "Nutrition sportive", "Récupération"] },
      ],
    },
    {
      name: "Preference Alimentaire",
      icon: SettingsIcon,
      subclasses: [
        { name: "Végétarien", examples: ["Pas de viande", "Oeufs OK", "Produits laitiers OK"] },
        { name: "Végan", examples: ["Pas de produits animaux", "Protéines végétales", "Suppléments B12"] },
        { name: "Sans Gluten", examples: ["Riz", "Maïs", "Pommes de terre", "Fruits"] },
        { name: "Bio", examples: ["Produits certifiés", "Pas de pesticides", "Naturel"] },
      ],
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSubclassClick = (className, subclass) => {
    if (onSelectSubclass) {
      onSelectSubclass(className, subclass)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-sidebar-accent lg:hidden transition-colors"
      >
        <Menu size={24} className="text-sidebar-foreground" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-80 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 z-40 shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Classes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manage nutrition data</p>
            </div>
          </div>
        </div>

        {/* Classes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {classes.map((classItem) => (
            <div key={classItem.name}>
              <button
                onClick={() => setExpandedMenu(expandedMenu === classItem.name ? null : classItem.name)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all duration-200 flex items-center gap-3 group hover:scale-[1.02]"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${expandedMenu === classItem.name ? 'from-blue-500 to-purple-500' : 'from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800'} transition-all duration-200`}>
                  <classItem.icon size={16} className={expandedMenu === classItem.name ? 'text-white' : 'text-slate-600 dark:text-slate-400'} />
                </div>
                <span className="text-sm font-semibold flex-1">{classItem.name}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 text-slate-500 dark:text-slate-400 ${expandedMenu === classItem.name ? "rotate-180" : ""}`}
                />
              </button>

              {/* Subclasses */}
              {expandedMenu === classItem.name && classItem.subclasses.length > 0 && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-blue-500/30 dark:border-purple-500/30 pl-4 animate-in slide-in-from-top-2 duration-300">
                  {classItem.subclasses.map((subclass) => (
                    <button
                      key={subclass.name}
                      onClick={() => handleSubclassClick(classItem.name, subclass)}
                      className="w-full text-left p-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150 cursor-pointer hover:translate-x-1"
                    >
                      {subclass.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
          {user && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">👤 Administrator</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
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
