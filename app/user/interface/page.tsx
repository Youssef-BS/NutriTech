"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import ChatArea from "@/components/chat-area"
import MessageInput from "@/components/message-input"

export default function UserInterface() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState([
    { id: 1, title: "Nutrition Tips", active: true },
    { id: 2, title: "Meal Planning", active: false },
    { id: 3, title: "Dietary Constraints", active: false },
  ])
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you with your nutrition today?", sender: "assistant", timestamp: new Date() },
  ])
  const [currentConversationId, setCurrentConversationId] = useState(1)

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "user") {
      router.push("/")
    }
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || user?.role !== "user") {
    return null
  }

  const handleNewChat = () => {
    const newId = Math.max(...conversations.map((c) => c.id), 0) + 1
    const newConversation = { id: newId, title: `Chat ${newId}`, active: false }
    setConversations([newConversation, ...conversations.map((c) => ({ ...c, active: false }))])
    setCurrentConversationId(newId)
    setMessages([])
  }

  const handleDeleteConversation = (id) => {
    const filtered = conversations.filter((c) => c.id !== id)
    setConversations(filtered)
    if (currentConversationId === id && filtered.length > 0) {
      setCurrentConversationId(filtered[0].id)
    }
  }

  const handleSelectConversation = (id) => {
    setConversations(conversations.map((c) => ({ ...c, active: c.id === id })))
    setCurrentConversationId(id)
  }

  const handleSendMessage = async (text) => {
    // Create user message
    const userMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
      timestamp: new Date(),
    };
  
    setMessages([...messages, userMessage]);
  
    try {
      // Fetch response from your FastAPI endpoint
      const response = await fetch(
        `http://127.0.0.1:8000/nlp2sparql?prompt=${encodeURIComponent(text)}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Extract the AI response (SPARQL query or text)
      // const assistantText = data.sparql_query || data.response || "No response from AI.";
     
       // FIX: Use proper JavaScript functions
    console.log("API Response:", data); // Use console.log instead of print()

    let assistantText;
    if (typeof data === 'string') {
      assistantText = data;
    } else if (data.message) {
      assistantText = data.message;
    } else if (data.response) {
      assistantText = data.response;
    } else if (data.sparql_query) {
      assistantText = data.sparql_query;
    } else {
      assistantText = JSON.stringify(data); // Use JSON.stringify instead of string()
    }
  
      const assistantMessage = {
        id: messages.length + 2,
        text: assistantText || "No results",
        sender: "assistant",
        timestamp: new Date(),
      }
      
  
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
  
      const errorMessage = {
        id: messages.length + 2,
        text: "⚠️ Error fetching AI response. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleLogout = () => {
    router.push("/")
  }

  const handleClassSelect = async (className: string) => {
    // Add user message asking about the class
    const userMessage = {
      id: messages.length + 1,
      text: `Show me all ${className} instances`,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    
    try {
      const FUSEKI_ENDPOINT =
        process.env.NEXT_PUBLIC_FUSEKI_ENDPOINT || "http://localhost:3030/ontologie/query"

      // Query to get all instances including from subclasses (using UNION to handle both cases)
      const sparqlQuery = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX nutri: <http://test.org/nutritech-ontology-3.owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT DISTINCT ?instance ?property ?value WHERE {
          {
            # Direct instances of the class
            ?instance rdf:type nutri:${className} .
            ?instance ?property ?value .
            FILTER(?property != rdf:type)
          }
          UNION
          {
            # Instances of subclasses
            ?subclass rdfs:subClassOf+ nutri:${className} .
            ?instance rdf:type ?subclass .
            ?instance ?property ?value .
            FILTER(?property != rdf:type)
          }
        }
        ORDER BY ?instance
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
      console.log(`🔍 Instances for ${className} (including subclasses):`, data.results.bindings)

      // Group properties by instance
      const instancesMap = {}
      data.results.bindings.forEach((b) => {
        const instanceUri = b.instance?.value
        const instanceName = instanceUri?.split("#")[1] || instanceUri?.split("/").pop()
        const propertyName = b.property?.value?.split("#")[1] || b.property?.value?.split("/").pop()
        const value = b.value?.value

        if (!instancesMap[instanceName]) {
          instancesMap[instanceName] = {
            name: instanceName,
            properties: {}
          }
        }

        instancesMap[instanceName].properties[propertyName] = value
      })

      const instances = Object.values(instancesMap)
      
      // Add assistant message with the data
      const assistantMessage = {
        id: messages.length + 2,
        text: instances.length > 0 
          ? `Found ${instances.length} instance(s) of ${className}` 
          : `No instances found for ${className}`,
        sender: "assistant",
        timestamp: new Date(),
        classData: instances, // Store the instances data
        className: className,
      }
      
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error(`Error fetching instances for ${className}:`, err)
      const errorMessage = {
        id: messages.length + 2,
        text: `⚠️ Error fetching instances for ${className}. Please try again.`,
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onSelectConversation={handleSelectConversation}
        onLogout={handleLogout}
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onOpenSettings={() => {}}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} onClassSelect={handleClassSelect} />
        <ChatArea messages={messages} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
