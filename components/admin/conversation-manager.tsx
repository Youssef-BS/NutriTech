"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Search, Eye } from "lucide-react"

interface Conversation {
  id: string
  userId: string
  userName: string
  title: string
  messageCount: number
  lastMessage: string
  timestamp: Date
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    title: "Meal Planning",
    messageCount: 12,
    lastMessage: "What should I eat for dinner?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    title: "Allergy Management",
    messageCount: 8,
    lastMessage: "I need gluten-free options",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    userId: "user3",
    userName: "Bob Johnson",
    title: "Weight Loss Plan",
    messageCount: 24,
    lastMessage: "How many calories should I consume?",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]

export default function ConversationManager() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Management</CardTitle>
        <CardDescription>Monitor and review all user conversations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Conversations List */}
          <div className="space-y-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{conv.title}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {conv.messageCount} messages
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{conv.userName}</p>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(conv.timestamp)}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <Eye size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
