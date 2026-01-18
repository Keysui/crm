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
    iconSize: "h-[18px] w-[18px]",
    description: "from last month",
    color: "from-[#00E0FF] to-[#00C6FF]",
  },
  {
    title: "Lead Conversion Rate",
    value: "28.4%",
    change: "+3.2%",
    trend: "up" as const,
    icon: TrendingUp,
    iconSize: "h-[18px] w-[18px]",
    description: "from last month",
    color: "from-[#00C6FF] to-[#0072FF]",
  },
  {
    title: "Voice Calls Handled",
    value: "5,891",
    change: "+24.1%",
    trend: "up" as const,
    icon: Phone,
    iconSize: "h-[18px] w-[18px]",
    description: "24/7 automated",
    color: "from-[#00E0FF] to-[#0072FF]",
  },
  {
    title: "Appointments Booked",
    value: "342",
    change: "+8.2%",
    trend: "up" as const,
    icon: CheckCircle2,
    iconSize: "h-[19px] w-[19px]",
    description: "this month",
    color: "from-[#00C6FF] to-[#10b981]",
    titleMaxWidth: "max-w-[85px]",
  },
  {
    title: "Chat Conversations",
    value: "2,156",
    change: "+15.7%",
    trend: "up" as const,
    icon: MessageSquare,
    iconSize: "h-[19px] w-[19px]",
    description: "completed",
    color: "from-[#00E0FF] to-[#3b82f6]",
    titleMaxWidth: "max-w-[85px]",
  },
  {
    title: "Monthly Revenue",
    value: "$45.2K",
    change: "+18.3%",
    trend: "up" as const,
    icon: DollarSign,
    iconSize: "h-[18px] w-[18px]",
    description: "MRR growth",
    color: "from-[#00C6FF] to-[#0072FF]",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const isPositive = stat.trend === "up"
        return (
          <Card
            key={stat.title}
            className="group border border-gray-200/80 hover:border-[#00C6FF] shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden relative"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <CardHeader className={`flex flex-row items-center space-y-0 pb-4 pt-5 relative z-10 ${(stat as any).titleMaxWidth ? 'px-4 gap-5' : 'px-5 gap-4'}`}>
              <CardTitle className={`text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] leading-tight ${(stat as any).titleMaxWidth ? 'min-w-0' : 'flex-1 min-w-0'} ${(stat as any).titleMaxWidth || 'max-w-[calc(100%-3rem)]'}`}>
                {stat.title}
              </CardTitle>
              <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 shrink-0`}>
                <Icon className={`${stat.iconSize} text-white stroke-[2.5]`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-3 px-5 pb-5">
              <div className={`text-2xl font-bold tracking-tight gradient-text leading-none`}>
                {stat.value}
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                {isPositive ? (
                  <ArrowUp className="h-3.5 w-3.5 text-[#10b981] shrink-0 mt-0.5" strokeWidth={2.5} />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5 text-[#ef4444] shrink-0 mt-0.5" strokeWidth={2.5} />
                )}
                <span className={`text-xs font-semibold leading-none ${isPositive ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                  {stat.change}
                </span>
                <span className="text-[11px] text-[#9ca3af] leading-none">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
