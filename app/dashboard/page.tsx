import { StatsCards } from "@/components/dashboard/stats-cards"
import { CallsVsLeadsChart } from "@/components/dashboard/charts"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your CRM dashboard
        </p>
      </div>
      
      {/* Top Row: Stat Cards */}
      <StatsCards />
      
      {/* Middle Row: Chart (66%) and Activity Feed (33%) */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0">
          <CallsVsLeadsChart />
        </div>
        <div className="min-w-0">
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
