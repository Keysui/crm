"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Phone, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConnectionStatusProps {
  type: "vapi" | "twilio"
  isActive: boolean
  onConnect?: () => void
  onTestCall?: () => void
}

export function ConnectionStatus({ 
  type, 
  isActive, 
  onConnect,
  onTestCall 
}: ConnectionStatusProps) {
  const isVapi = type === "vapi"
  const Icon = isVapi ? Phone : MessageSquare
  const title = isVapi 
    ? "AI Voice Agent" 
    : "SMS Chatbot"
  const description = isVapi
    ? "Your AI voice agent is ready to handle calls 24/7"
    : "Your SMS chatbot is ready to handle text conversations"

  if (isActive) {
    return (
      <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                <CheckCircle2 className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={cn(
                    "h-5 w-5",
                    isVapi ? "text-[#00C6FF]" : "text-[#0072FF]"
                  )} />
                  <h3 className="text-xl font-semibold text-[#1f2937] dark:text-[#f1f5f9]">
                    {title} is Active
                  </h3>
                </div>
                <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] leading-relaxed">
                  {description}
                </p>
                {isVapi && onTestCall && (
                  <div className="mt-4">
                    <Button
                      onClick={onTestCall}
                      className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white hover:from-[#00E0FF] hover:to-[#00C6FF] shadow-md hover:shadow-lg transition-all"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Test Call
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Icon className={cn(
                "h-6 w-6",
                isVapi ? "text-[#00C6FF]" : "text-[#0072FF]"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold text-[#1f2937] dark:text-[#f1f5f9]">
                  {title} Not Connected
                </h3>
              </div>
              <p className="text-sm text-[#6b7280] dark:text-[#94a3b8] leading-relaxed mb-4">
                Connect your {isVapi ? "Vapi" : "Twilio"} account to start using {isVapi ? "AI voice calls" : "SMS chatbots"}
              </p>
              {onConnect && (
                <Button
                  onClick={onConnect}
                  className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white hover:from-[#00E0FF] hover:to-[#00C6FF] shadow-md hover:shadow-lg transition-all"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  Connect {isVapi ? "Vapi" : "Twilio"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
