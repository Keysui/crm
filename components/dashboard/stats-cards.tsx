"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Users, Zap, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Calls",
    value: "1,247",
    change: "+12.5%",
    trend: "up" as const,
    icon: Phone,
    description: "from last month",
  },
  {
    title: "Leads Booked",
    value: "342",
    change: "+8.2%",
    trend: "up" as const,
    icon: Users,
    description: "from last month",
  },
  {
    title: "Automations Ran",
    value: "5,891",
    change: "+24.1%",
    trend: "up" as const,
    icon: Zap,
    description: "from last month",
  },
  {
    title: "Money Saved",
    value: "$12,450",
    change: "+18.3%",
    trend: "up" as const,
    icon: DollarSign,
    description: "from last month",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span>{" "}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
