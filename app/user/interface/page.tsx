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

  const handleSendMessage = (text) => {
    const newMessage = { id: messages.length + 1, text, sender: "user", timestamp: new Date() }
    setMessages([...messages, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "I'm here to help with your nutrition questions!",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 500)
  }

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
