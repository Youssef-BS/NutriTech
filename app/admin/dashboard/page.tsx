"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminChatArea from "@/components/admin/admin-chat-area"
import MessageInput from "@/components/message-input"
import { ChevronLeft } from "lucide-react"

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState([
    { id: 1, title: "John Doe", active: true, user: "John", lastMessage: "What's my daily protein intake?" },
    { id: 2, title: "Sarah Smith", active: false, user: "Sarah", lastMessage: "Can you suggest a meal plan?" },
    { id: 3, title: "Mike Johnson", active: false, user: "Mike", lastMessage: "I'm allergic to gluten" },
  ])
  const [messages, setMessages] = useState([
    { id: 1, text: "What's my daily protein intake?", sender: "user", timestamp: new Date() },
    {
      id: 2,
      text: "Based on your weight, I recommend 1.6-2.2g per kg of body weight daily.",
      sender: "admin",
      timestamp: new Date(),
    },
  ])
  const [currentConversationId, setCurrentConversationId] = useState(1)
  const [selectedSubclass, setSelectedSubclass] = useState(null)
  const [selectedClassName, setSelectedClassName] = useState(null)

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "admin") {
      router.push("/")
    }
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || user?.role !== "admin") {
    return null
  }

  const handleSelectConversation = (id) => {
    setConversations(conversations.map((c) => ({ ...c, active: c.id === id })))
    setCurrentConversationId(id)
    const conversationMessages = {
      1: [
        { id: 1, text: "What's my daily protein intake?", sender: "user", timestamp: new Date() },
        {
          id: 2,
          text: "Based on your weight, I recommend 1.6-2.2g per kg of body weight daily.",
          sender: "admin",
          timestamp: new Date(),
        },
      ],
      2: [{ id: 1, text: "Can you suggest a meal plan?", sender: "user", timestamp: new Date() }],
      3: [
        { id: 1, text: "I'm allergic to gluten", sender: "user", timestamp: new Date() },
        { id: 2, text: "I'll create a gluten-free meal plan for you.", sender: "admin", timestamp: new Date() },
      ],
    }
    setMessages(conversationMessages[id] || [])
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

  const handleSelectSubclass = (className, subclass) => {
    setSelectedClassName(className)
    setSelectedSubclass(subclass)
  }

  const handleBackToConversations = () => {
    setSelectedSubclass(null)
    setSelectedClassName(null)
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onSelectSubclass={handleSelectSubclass}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Conversations or Subclass Items */}
          <div className="w-80 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl overflow-y-auto">
            {selectedSubclass ? (
              <div className="p-4 space-y-2">
                <button
                  onClick={handleBackToConversations}
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors font-medium hover:translate-x-1 transition-transform duration-200"
                >
                  <ChevronLeft size={16} />
                  Back to Conversations
                </button>
                <h3 className="font-bold text-base mb-4 text-slate-900 dark:text-slate-100">{selectedSubclass.name}</h3>
                <div className="space-y-2">
                  {selectedSubclass.examples.map((example, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500/30 dark:hover:border-purple-500/30 hover:scale-[1.02] shadow-sm hover:shadow-md"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Show conversations by default
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-base mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">User Conversations</h3>
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                      conv.active 
                        ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/50 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                        conv.active 
                          ? "bg-gradient-to-br from-blue-600 to-purple-600" 
                          : "bg-gradient-to-br from-slate-400 to-slate-600"
                      }`}>
                        {conv.user.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm truncate ${
                          conv.active 
                            ? "text-blue-600 dark:text-blue-400" 
                            : "text-slate-800 dark:text-slate-200"
                        }`}>
                          {conv.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">@{conv.user}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 truncate pl-13">
                      {conv.lastMessage}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminChatArea messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  )
}
