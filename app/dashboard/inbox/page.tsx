"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Phone, 
  MessageSquare, 
  ClipboardCheck,
  Play,
  Pause,
  CheckCircle2,
  PhoneCall,
  Archive,
  ArrowLeft
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { cn } from "@/lib/utils"

// Unified interaction types
type InteractionType = 'voice' | 'sms' | 'booking'

interface BaseInteraction {
  id: string
  type: InteractionType
  contactName: string
  contactPhone: string
  timestamp: Date
  aiSummary: string
  leadAdded: boolean
  leadUpdated?: boolean
}

interface VoiceInteraction extends BaseInteraction {
  type: 'voice'
  duration: number // in seconds
  recordingUrl?: string
  transcript: string
  sentiment: 'positive' | 'neutral' | 'negative'
}

interface SMSInteraction extends BaseInteraction {
  type: 'sms'
  messageCount: number
  messages: Array<{
    id: string
    text: string
    sender: 'user' | 'lead'
    timestamp: Date
  }>
}

interface BookingInteraction extends BaseInteraction {
  type: 'booking'
  serviceType: string
  formData: {
    budget?: string
    timeline?: string
    email?: string
    preferredTime?: string
    [key: string]: string | undefined
  }
}

type Interaction = VoiceInteraction | SMSInteraction | BookingInteraction

// Mock data
const mockInteractions: Interaction[] = [
  {
    id: "1",
    type: "voice",
    contactName: "Sarah Johnson",
    contactPhone: "+1 (555) 234-5678",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    duration: 245, // 4 minutes 5 seconds
    aiSummary: "Client asked about pricing for the Premium Plan. Interested in moving forward. Mentioned they have a team of 10 people and need enterprise features.",
    leadAdded: true,
    transcript: "AI: Hello, thank you for calling ScaleMako. How can I help you today?\n\nSarah: Hi, I'm interested in your AI voice agent service. Can you tell me about pricing?\n\nAI: Absolutely! We offer three plans: Basic at $99/month, Pro at $299/month, and Premium at $799/month. Which one are you interested in?\n\nSarah: I'm looking at the Premium plan. What features does it include?\n\nAI: The Premium plan includes unlimited calls, advanced analytics, custom AI training, priority support, and integration with your CRM. It's perfect for teams of 10 or more.\n\nSarah: That sounds great. I have a team of 10 people and we definitely need those enterprise features. How do we get started?\n\nAI: I can schedule a demo call for you. Would tomorrow at 2 PM work?\n\nSarah: Yes, that would be perfect!\n\nAI: Great! I've scheduled your demo for tomorrow at 2 PM. You'll receive a confirmation email shortly. Is there anything else I can help you with?\n\nSarah: No, that's all. Thank you!\n\nAI: You're welcome! Have a great day!",
    sentiment: "positive"
  },
  {
    id: "2",
    type: "sms",
    contactName: "Mike Davis",
    contactPhone: "+1 (555) 345-6789",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    messageCount: 8,
    aiSummary: "Bot successfully qualified lead. User provided email and budget. Expressed interest in Pro plan.",
    leadAdded: false,
    leadUpdated: true,
    messages: [
      {
        id: "m1",
        text: "Hi, I'm interested in your services",
        sender: "lead",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: "m2",
        text: "Hello! I'd be happy to help. What specific services are you interested in?",
        sender: "user",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1 * 60 * 1000)
      },
      {
        id: "m3",
        text: "AI voice agents for customer support",
        sender: "lead",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 2 * 60 * 1000)
      },
      {
        id: "m4",
        text: "Perfect! We offer AI voice agents that can handle customer calls 24/7. What's your email so I can send you more information?",
        sender: "user",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3 * 60 * 1000)
      },
      {
        id: "m5",
        text: "mike.davis@company.com",
        sender: "lead",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 4 * 60 * 1000)
      },
      {
        id: "m6",
        text: "Great! What's your approximate monthly budget for this service?",
        sender: "user",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000)
      },
      {
        id: "m7",
        text: "Around $500 per month",
        sender: "lead",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 6 * 60 * 1000)
      },
      {
        id: "m8",
        text: "Perfect! I've sent you detailed information about our Pro plan which fits your budget. Check your email!",
        sender: "user",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 7 * 60 * 1000)
      }
    ]
  },
  {
    id: "3",
    type: "booking",
    contactName: "John Smith",
    contactPhone: "+1 (555) 123-4567",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    aiSummary: "New booking request for Enterprise consultation. Budget: $10k, Timeline: ASAP",
    leadAdded: true,
    serviceType: "Enterprise Consultation",
    formData: {
      budget: "$10,000",
      timeline: "ASAP",
      email: "john.smith@enterprise.com",
      preferredTime: "Morning (9 AM - 12 PM)",
      companySize: "50-100 employees",
      useCase: "Customer support automation"
    }
  }
]

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    // Auto-select first interaction
    if (mockInteractions.length > 0) {
      setSelectedId(mockInteractions[0].id)
    }
  }, [])

  const selectedInteraction = mockInteractions.find(i => i.id === selectedId) || null

  const formatTime = (date: Date) => {
    if (!isMounted) return "just now"
    return formatDistanceToNow(date, { addSuffix: true })
  }

  if (!isMounted) {
    return (
      <div className="h-[calc(100vh-8rem)] flex">
        <div className="w-[350px] border-r bg-gray-50 dark:bg-[#0f172a] animate-pulse" />
        <div className="flex-1 bg-white dark:bg-[#1e293b] animate-pulse" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex border rounded-lg overflow-hidden bg-white dark:bg-[#1e293b]">
      {/* Left Sidebar - Master List */}
      <div className="w-[350px] border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f172a] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
          <h2 className="text-lg font-semibold text-[#1f2937] dark:text-[#f1f5f9]">Inbox</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mockInteractions.length} interactions
          </p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {mockInteractions.map((interaction) => {
              const isSelected = selectedId === interaction.id
              return (
                <button
                  key={interaction.id}
                  onClick={() => setSelectedId(interaction.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200",
                    isSelected
                      ? "bg-[#00C6FF]/10 dark:bg-[#00C6FF]/20 border-2 border-[#00C6FF] shadow-sm"
                      : "bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        interaction.type === "voice" &&
                          "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
                        interaction.type === "sms" &&
                          "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400",
                        interaction.type === "booking" &&
                          "bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                      )}
                    >
                      {interaction.type === "voice" && <Phone className="h-4 w-4" />}
                      {interaction.type === "sms" && <MessageSquare className="h-4 w-4" />}
                      {interaction.type === "booking" && <ClipboardCheck className="h-4 w-4" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-[#1f2937] dark:text-[#f1f5f9] truncate">
                          {interaction.contactName}
                        </h3>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {formatTime(interaction.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {interaction.aiSummary}
                      </p>
                      {interaction.leadAdded && (
                        <div className="mt-1.5">
                          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-[10px] h-4 px-1.5">
                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                            Lead Added
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Detail View */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e293b] overflow-hidden">
        {selectedInteraction ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white text-lg font-semibold">
                      {getInitials(selectedInteraction.contactName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-semibold text-[#1f2937] dark:text-[#f1f5f9] mb-1">
                      {selectedInteraction.contactName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {selectedInteraction.contactPhone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Call Back
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-[#00C6FF]/10 dark:bg-[#00C6FF]/20 border border-[#00C6FF]/20 dark:border-[#00C6FF]/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#00C6FF] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] text-white font-bold">AI</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#00C6FF] dark:text-[#00E0FF] mb-1.5">
                      AI Summary
                    </p>
                    <p className="text-sm text-[#1f2937] dark:text-[#f1f5f9] leading-relaxed">
                      {selectedInteraction.aiSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-6">
                {selectedInteraction.type === "voice" && (
                  <div className="space-y-6 max-w-4xl">
                    {/* Audio Player */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12"
                          onClick={() => setPlayingId(playingId === selectedInteraction.id ? null : selectedInteraction.id)}
                        >
                          {playingId === selectedInteraction.id ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="text-sm font-semibold mb-1">Call Recording</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDuration((selectedInteraction as VoiceInteraction).duration)}
                          </div>
                        </div>
                      </div>
                      {/* Waveform Mock */}
                      <div className="flex items-end gap-1 h-16">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-[#00C6FF] rounded-t transition-all hover:bg-[#0072FF]"
                            style={{
                              height: `${Math.random() * 70 + 20}%`
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Transcript */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#1f2937] dark:text-[#f1f5f9] mb-4">
                        Full Transcript
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <pre className="text-sm text-[#1f2937] dark:text-[#f1f5f9] whitespace-pre-wrap font-sans leading-relaxed">
                            {(selectedInteraction as VoiceInteraction).transcript}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedInteraction.type === "sms" && (
                  <div className="space-y-4 max-w-2xl">
                    <h3 className="text-lg font-semibold text-[#1f2937] dark:text-[#f1f5f9] mb-4">
                      Conversation History
                    </h3>
                    <div className="space-y-3">
                      {(selectedInteraction as SMSInteraction).messages.map((msg) => {
                        const isUser = msg.sender === "user"
                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-3",
                              isUser ? "justify-end" : "justify-start"
                            )}
                          >
                            {!isUser && (
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white text-xs">
                                  {getInitials(selectedInteraction.contactName)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={cn(
                                "max-w-[75%] rounded-2xl px-4 py-3",
                                isUser
                                  ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-[#1f2937] dark:text-[#f1f5f9]"
                              )}
                            >
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                              <p
                                className={cn(
                                  "text-xs mt-1.5",
                                  isUser ? "text-white/70" : "text-muted-foreground"
                                )}
                              >
                                {format(msg.timestamp, "h:mm a")}
                              </p>
                            </div>
                            {isUser && (
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                                  AI
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedInteraction.type === "booking" && (
                  <div className="space-y-4 max-w-3xl">
                    <h3 className="text-lg font-semibold text-[#1f2937] dark:text-[#f1f5f9] mb-4">
                      Booking Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries((selectedInteraction as BookingInteraction).formData).map(
                        ([key, value]) => (
                          <Card
                            key={key}
                            className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                          >
                            <CardContent className="p-4">
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </div>
                              <div className="text-sm font-semibold text-[#1f2937] dark:text-[#f1f5f9]">
                                {value || "-"}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-[#1f2937] dark:text-[#f1f5f9] mb-2">
                Select an interaction
              </p>
              <p className="text-sm text-muted-foreground">
                Choose an interaction from the sidebar to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
