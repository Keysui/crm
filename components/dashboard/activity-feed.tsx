"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MessageSquare, Calendar, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const getActivities = () => [
  {
    id: 1,
    type: "call",
    message: "Received call from (555) 123-4567 - Booked Demo",
    time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    icon: Phone,
    color: "blue",
  },
  {
    id: 2,
    type: "sms",
    message: "Sent SMS to +1 (555) 987-6543 - Follow up scheduled",
    time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    icon: MessageSquare,
    color: "green",
  },
  {
    id: 3,
    type: "booking",
    message: "New lead booked: John Smith - Appointment confirmed",
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    icon: Calendar,
    color: "purple",
  },
  {
    id: 4,
    type: "automation",
    message: "Automation completed: Review request sent to 5 customers",
    time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    icon: CheckCircle2,
    color: "orange",
  },
  {
    id: 5,
    type: "call",
    message: "Received call from (555) 234-5678 - Interested in pricing",
    time: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    icon: Phone,
    color: "blue",
  },
  {
    id: 6,
    type: "booking",
    message: "Lead converted: Sarah Johnson - Demo completed",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: CheckCircle2,
    color: "green",
  },
]

export function ActivityFeed() {
  const [activities, setActivities] = useState<ReturnType<typeof getActivities>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setActivities(getActivities())
  }, [])

  if (!mounted) {
    return (
      <Card className="border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
        <CardHeader className="pb-5 pt-6 px-6">
          <CardTitle className="text-xl font-semibold font-display text-[#1f2937] leading-tight mb-1.5">
            Recent Activity
          </CardTitle>
          <CardDescription className="text-sm text-[#6b7280] leading-relaxed">
            Latest updates from your CRM and automations
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5, 6].map((id) => (
              <div key={id} className="flex items-start gap-3.5 p-3.5 rounded-xl">
                <div className="h-9 w-9 rounded-lg bg-gray-200 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="border border-gray-200/80 hover:border-[#00C6FF] shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardHeader className="pb-5 pt-6 px-6">
        <CardTitle className="text-xl font-semibold font-display text-[#1f2937] leading-tight mb-1.5">
          Recent Activity
        </CardTitle>
        <CardDescription className="text-sm text-[#6b7280] leading-relaxed">
          Latest updates from your CRM and automations
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-2.5">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-[#f9fafb] transition-colors duration-200 group border border-transparent hover:border-[#00C6FF]/20"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center bg-gradient-to-br shrink-0 ${
                    activity.color === "blue" 
                      ? "from-[#00C6FF] to-[#0072FF]" 
                      : activity.color === "green" 
                      ? "from-[#10b981] to-[#059669]" 
                      : activity.color === "purple" 
                      ? "from-[#8b5cf6] to-[#7c3aed]" 
                      : "from-[#f59e0b] to-[#d97706]"
                  } shadow-sm group-hover:shadow-md transition-all duration-200`}
                >
                  <Icon className="h-4 w-4 text-white stroke-[2.5]" />
                </div>
                <div className="flex-1 space-y-1 min-w-0 pt-0.5">
                  <p className="text-sm font-medium leading-relaxed text-[#1f2937]">
                    {activity.message}
                  </p>
                  <p className="text-[11px] text-[#9ca3af] leading-tight">
                    {formatDistanceToNow(activity.time, { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
