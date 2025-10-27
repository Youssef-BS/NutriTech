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
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, user, onSelectSubclass }) {
  const [expandedMenu, setExpandedMenu] = useState(null)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { logout } = useAuth()
  const router = useRouter()

  // Map class names to icons
  const iconMap = {
    "Aliments": Apple,
    "Contraintes Medicales": AlertCircle,
    "Recettes": BookOpen,
    "Nutriments": Utensils,
    "Activite Physique": Activity,
    "Objectif Personnel": Target,
    "Preference Alimentaire": SettingsIcon,
  }

  // Default icon if class name not found
  const DefaultIcon = SettingsIcon

  // Fetch classes and subclasses from Fuseki
// Fetch classes and subclasses from Fuseki
useEffect(() => {
  const fetchClassesFromFuseki = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const FUSEKI_ENDPOINT =
        process.env.NEXT_PUBLIC_FUSEKI_ENDPOINT ||
        "http://localhost:3030/ontologie/query"; // ✅ Use /query endpoint

      const sparqlQuery = `
        PREFIX nutri: <http://test.org/nutritech-ontology-3.owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
              SELECT * WHERE {
            ?sub ?pred ?obj .
          }
      `;

      // ✅ Correct Fuseki request
      const response = await fetch(FUSEKI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/sparql-results+json"
        },
        body: `query=${encodeURIComponent(sparqlQuery)}`
      });

      console.log("Fuseki response status:", response.status);
      console.log("Fuseki response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`Fuseki server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fuseki data:", data);

      if (!data?.results?.bindings) {
        throw new Error("Invalid SPARQL response format");
      }

      const processedClasses = processSparqlResults(data.results.bindings);
      setClasses(processedClasses);

    } catch (err) {
      console.error("Error fetching data from Fuseki:", err);
      setError(err.message);
      setClasses([]); // fallback to empty list
    } finally {
      setLoading(false);
    }
  };

  fetchClassesFromFuseki();
}, []);


  // Process SPARQL results into the expected class structure
  const processSparqlResults = (bindings) => {
    const classMap = new Map()

    bindings.forEach(binding => {
      // Process class
      if (binding.class && binding.classLabel) {
        const classUri = binding.class.value
        const className = binding.classLabel.value
        
        if (!classMap.has(classUri)) {
          classMap.set(classUri, {
            name: className,
            icon: iconMap[className] || DefaultIcon,
            subclasses: []
          })
        }
      }

      // Process subclass
      if (binding.subclass && binding.subclassLabel) {
        const classUri = binding.class?.value
        const subclassUri = binding.subclass.value
        const subclassName = binding.subclassLabel.value
        
        if (classUri && classMap.has(classUri)) {
          const classData = classMap.get(classUri)
          const existingSubclass = classData.subclasses.find(sc => sc.name === subclassName)
          
          if (!existingSubclass) {
            classData.subclasses.push({
              name: subclassName,
              examples: []
            })
          }
        }
      }

      // Process examples
      if (binding.example && binding.exampleLabel) {
        const subclassUri = binding.subclass?.value
        const exampleName = binding.exampleLabel.value
        
        if (subclassUri) {
          // Find the subclass that contains this example
          for (let classData of classMap.values()) {
            const subclass = classData.subclasses.find(sc => {
              // You might need to adjust this logic based on your actual URI structure
              return sc.name === binding.subclassLabel?.value
            })
            
            if (subclass && !subclass.examples.includes(exampleName)) {
              subclass.examples.push(exampleName)
            }
          }
        }
      }
    })

    // Convert Map to array and ensure we have the main classes even if they have no subclasses
    const result = Array.from(classMap.values())
    
    // If no data was fetched, return empty array


    return result
  }

  // Fallback data in case Fuseki is not available


  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSubclassClick = (className, subclass) => {
    if (onSelectSubclass) {
      onSelectSubclass(className, subclass)
    }
  }

  if (loading) {
    return (
      <div className={`fixed lg:relative w-80 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 z-40 shadow-2xl ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading classes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`fixed lg:relative w-80 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 z-40 shadow-2xl ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 mb-2">Error loading data</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
          </div>
        </div>
      </div>
    )
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
          {classes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">No classes found</p>
            </div>
          ) : (
            classes.map((classItem) => (
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
            ))
          )}
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