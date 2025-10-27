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
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <ChatArea messages={messages} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
