"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, CheckCircle2, DollarSign, Phone, MessageSquare } from "lucide-react"
import { ArrowUp, ArrowDown } from "lucide-react"

const stats = [
  {
    title: "Total Leads Generated",
    value: "1,247",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    description: "from last month",
    color: "from-[#00E0FF] to-[#00C6FF]",
  },
  {
    title: "Lead Conversion Rate",
    value: "28.4%",
    change: "+3.2%",
    trend: "up" as const,
    icon: TrendingUp,
    description: "from last month",
    color: "from-[#00C6FF] to-[#0072FF]",
  },
  {
    title: "Voice Calls Handled",
    value: "5,891",
    change: "+24.1%",
    trend: "up" as const,
    icon: Phone,
    description: "24/7 automated",
    color: "from-[#00E0FF] to-[#0072FF]",
  },
  {
    title: "Appointments Booked",
    value: "342",
    change: "+8.2%",
    trend: "up" as const,
    icon: CheckCircle2,
    description: "this month",
    color: "from-[#00C6FF] to-[#10b981]",
  },
  {
    title: "Chat Conversations",
    value: "2,156",
    change: "+15.7%",
    trend: "up" as const,
    icon: MessageSquare,
    description: "completed",
    color: "from-[#00E0FF] to-[#3b82f6]",
  },
  {
    title: "Monthly Revenue",
    value: "$45.2K",
    change: "+18.3%",
    trend: "up" as const,
    icon: DollarSign,
    description: "MRR growth",
    color: "from-[#00C6FF] to-[#0072FF]",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const isPositive = stat.trend === "up"
        return (
          <Card
            key={stat.title}
            className="group border border-gray-200 hover:border-[#00C6FF] shadow-sm hover:shadow-lg hover-lift transition-all duration-300 bg-white overflow-hidden relative"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-xs font-medium text-[#4b5563] uppercase tracking-wide">
                {stat.title}
              </CardTitle>
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-2">
              <div className={`text-2xl md:text-3xl font-bold tracking-tight gradient-text`}>
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <ArrowUp className="h-4 w-4 text-[#10b981]" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-[#ef4444]" />
                )}
                <span className={`text-sm font-semibold ${isPositive ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-[#9ca3af]">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
