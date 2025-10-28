"use client"

import {
  Menu,
  LogOut,
  Apple,
  AlertCircle,
  Activity,
  Target,
  Settings as SettingsIcon,
  Utensils,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, user, onSelectSubclass }) {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set())
  const [subclassesCache, setSubclassesCache] = useState<Record<string, any[]>>({})
  const { logout } = useAuth()
  const router = useRouter()

  const iconMap: Record<string, any> = {
    Utilisateur: AlertCircle,
    Adulte: AlertCircle,
    Enfant: AlertCircle,
    ContrainteMédicale: AlertCircle,
    AllergieAuGluten: AlertCircle,
    ObjectifPersonnel: Target,
    PréférenceAlimentaire: SettingsIcon,
    ActivitéPhysique: Activity,
    TypeActivite: Activity,
    Aliment: Apple,
    Légume: Apple,
    Nutriment: Utensils,
  }
  const DefaultIcon = SettingsIcon

  useEffect(() => {
    const fetchClassesFromFuseki = async () => {
      try {
        setLoading(true)
        setError(null)

        const FUSEKI_ENDPOINT =
          process.env.NEXT_PUBLIC_FUSEKI_ENDPOINT || "http://localhost:3030/ontologie/query"

        const sparqlQuery = `
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
          SELECT ?sub WHERE {
            ?sub rdfs:subClassOf owl:Thing .
          }
        `

        const response = await fetch(FUSEKI_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/sparql-results+json",
          },
          body: `query=${encodeURIComponent(sparqlQuery)}`,
        })

        if (!response.ok) throw new Error(`Fuseki error: ${response.status} ${response.statusText}`)

        const data = await response.json()
        console.log("🔍 Raw SPARQL bindings:", data.results.bindings)

        const processed = processSparqlResults(data.results.bindings)
        console.log("✅ Direct subclasses of Thing:", processed)
        setClasses(processed)
      } catch (err: any) {
        console.error("🔥 Error fetching from Fuseki:", err)
        setError(err.message)
        setClasses([])
      } finally {
        setLoading(false)
      }
    }

    fetchClassesFromFuseki()
  }, [])

  const processSparqlResults = (bindings: any[]) => {
    const subclasses: any[] = []
    const seen = new Set<string>()

    bindings.forEach((b) => {
      const sub = b.sub?.value?.split("#")[1]
      const parent = "Thing" // On sait que SPARQL filtre déjà par Thing

      if (!sub) return
      if (seen.has(sub)) return
      seen.add(sub)

      subclasses.push({
        name: sub,
        icon: iconMap[sub] || DefaultIcon,
        subclasses: [],
      })
    })

    return subclasses
  }

  // New function to fetch subclasses for a specific class
  const fetchSubclassesForClass = async (className: string) => {
    try {
      const FUSEKI_ENDPOINT =
        process.env.NEXT_PUBLIC_FUSEKI_ENDPOINT || "http://localhost:3030/ontologie/query"

      const sparqlQuery = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX nutri: <http://test.org/nutritech-ontology-3.owl#>
        SELECT ?subclass WHERE {
          ?subclass rdfs:subClassOf nutri:${className} .
        }
      `

      const response = await fetch(FUSEKI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/sparql-results+json",
        },
        body: `query=${encodeURIComponent(sparqlQuery)}`,
      })

      if (!response.ok) throw new Error(`Fuseki error: ${response.status}`)

      const data = await response.json()
      console.log(`🔍 Subclasses for ${className}:`, data.results.bindings)

      const subclasses = data.results.bindings.map((b: any) => {
        const subclassName = b.subclass?.value?.split("#")[1]
        return {
          name: subclassName,
          icon: iconMap[subclassName] || DefaultIcon,
        }
      })

      return subclasses
    } catch (err) {
      console.error(`Error fetching subclasses for ${className}:`, err)
      return []
    }
  }

  const toggleClass = async (className: string) => {
    const newExpanded = new Set(expandedClasses)
    
    if (expandedClasses.has(className)) {
      newExpanded.delete(className)
    } else {
      newExpanded.add(className)
      
      // Fetch subclasses if not already cached
      if (!subclassesCache[className]) {
        const subclasses = await fetchSubclassesForClass(className)
        setSubclassesCache({
          ...subclassesCache,
          [className]: subclasses,
        })
        
        // If no subclasses found, trigger the parent callback to show instances
        if (subclasses.length === 0 && onSelectSubclass) {
          onSelectSubclass("Thing", { name: className, icon: iconMap[className] || DefaultIcon })
        }
      }
    }
    
    setExpandedClasses(newExpanded)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSubclassClick = (cls: any) => {
    if (onSelectSubclass) onSelectSubclass("Thing", cls)
  }

  if (loading)
    return (
      <div className="w-80 h-screen flex items-center justify-center text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
        Loading...
      </div>
    )

  if (error)
    return (
      <div className="w-80 h-screen flex items-center justify-center text-red-700 dark:text-red-400 bg-white dark:bg-gray-900">
        {error}
      </div>
    )

  return (
    <>
      {/* Bouton mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
      >
        <Menu size={24} className="text-black dark:text-white" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-80 h-screen bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 shadow-xl transition-all duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-black dark:text-white">Ontology Browser</h2>
              <p className="text-xs text-gray-700 dark:text-gray-400">Direct subclasses of Thing</p>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-black dark:text-white">
          {classes.map((cls) => (
            <div key={cls.name} className="space-y-1">
              {/* Main class button */}
              <button
                onClick={() => toggleClass(cls.name)}
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 group-hover:bg-gray-300 dark:group-hover:bg-gray-700 transition-colors">
                    <cls.icon size={18} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="text-sm font-semibold text-black dark:text-white">{cls.name}</span>
                </div>
                <div className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {expandedClasses.has(cls.name) ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </div>
              </button>

              {/* Subclasses dropdown */}
              {expandedClasses.has(cls.name) && (
                <div className="ml-10 space-y-1 pl-3 border-l-2 border-purple-200 dark:border-purple-800">
                  {subclassesCache[cls.name]?.length > 0 ? (
                    subclassesCache[cls.name].map((subclass) => (
                      <button
                        key={subclass.name}
                        onClick={() => onSelectSubclass && onSelectSubclass(cls.name, subclass)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 flex items-center gap-2.5 transition-all text-gray-700 dark:text-gray-300 text-sm group"
                      >
                        <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                          <subclass.icon size={14} className="text-purple-700 dark:text-purple-400" />
                        </div>
                        <span className="group-hover:text-purple-900 dark:group-hover:text-purple-300 transition-colors">{subclass.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-500 p-2 italic flex items-center gap-2">
                      {subclassesCache[cls.name] ? (
                        "No subclasses found"
                      ) : (
                        <>
                          <span className="animate-spin">⏳</span>
                          Loading subclasses...
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3 text-black dark:text-white flex-shrink-0">
          {user && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">👤 Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}
