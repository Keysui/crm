import { StatsCards } from "@/components/dashboard/stats-cards"
import { CallsVsLeadsChart } from "@/components/dashboard/charts"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ConversionFunnel } from "@/components/dashboard/conversion-funnel"
import { CRMIntegrationWidget } from "@/components/dashboard/crm-integration-widget"

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-display">Dashboard</h1>
        <p className="text-[#4b5563] text-lg">
          Comprehensive overview of your CRM performance and business insights
        </p>
      </div>
      
      {/* Top Row: Key Metrics */}
      <StatsCards />
      
      {/* Middle Row: Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-6">
          <CallsVsLeadsChart />
          <ConversionFunnel />
        </div>
        <div className="min-w-0 space-y-6">
          <ActivityFeed />
          <CRMIntegrationWidget />
        </div>
      </div>
    </div>
  )
}
