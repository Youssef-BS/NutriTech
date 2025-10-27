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
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, user, onSelectSubclass }) {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout } = useAuth()
  const router = useRouter()

  const iconMap: Record<string, any> = {
    Utilisateur: AlertCircle,
    ContrainteMédicale: AlertCircle,
    ObjectifPersonnel: Target,
    PréférenceAlimentaire: SettingsIcon,
    ActivitéPhysique: Activity,
    TypeActivite: Activity,
    Aliment: Apple,
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

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSubclassClick = (cls: any) => {
    if (onSelectSubclass) onSelectSubclass("Thing", cls)
  }

  if (loading)
    return (
      <div className="w-80 h-screen flex items-center justify-center text-gray-800">
        Loading...
      </div>
    )

  if (error)
    return (
      <div className="w-80 h-screen flex items-center justify-center text-red-700">
        {error}
      </div>
    )

  return (
    <>
      {/* Bouton mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-gray-200 lg:hidden"
      >
        <Menu size={24} className="text-black" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-80 h-screen bg-white border-r border-gray-300 shadow-xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-black">Ontology Browser</h2>
              <p className="text-xs text-gray-700">Direct subclasses of Thing</p>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-black">
          {classes.map((cls) => (
            <button
              key={cls.name}
              onClick={() => handleSubclassClick(cls)}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-100 flex items-center gap-3 transition-colors text-black"
            >
              <div className="p-2 rounded-md bg-gray-200">
                <cls.icon size={16} className="text-black" />
              </div>
              <span className="text-sm font-semibold">{cls.name}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3 text-black">
          {user && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-gray-600">👤 Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-600 hover:text-red-800"
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
