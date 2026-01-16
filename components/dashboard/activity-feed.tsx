"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MessageSquare, Calendar, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const activities = [
  {
    id: 1,
    type: "call",
    message: "Received call from (555) 123-4567 - Booked Demo",
    time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    icon: Phone,
    color: "text-blue-500",
  },
  {
    id: 2,
    type: "sms",
    message: "Sent SMS to +1 (555) 987-6543 - Follow up scheduled",
    time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    icon: MessageSquare,
    color: "text-green-500",
  },
  {
    id: 3,
    type: "booking",
    message: "New lead booked: John Smith - Appointment confirmed",
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    icon: Calendar,
    color: "text-purple-500",
  },
  {
    id: 4,
    type: "automation",
    message: "Automation completed: Review request sent to 5 customers",
    time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    icon: CheckCircle2,
    color: "text-orange-500",
  },
  {
    id: 5,
    type: "call",
    message: "Received call from (555) 234-5678 - Interested in pricing",
    time: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    icon: Phone,
    color: "text-blue-500",
  },
  {
    id: 6,
    type: "booking",
    message: "Lead converted: Sarah Johnson - Demo completed",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: CheckCircle2,
    color: "text-green-500",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your CRM</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`mt-0.5 ${activity.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
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
