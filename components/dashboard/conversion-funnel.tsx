"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

const funnelStages = [
  { name: "Leads Generated", count: 1247, percentage: 100, color: "from-[#00E0FF] to-[#00C6FF]" },
  { name: "Qualified", count: 892, percentage: 71.5, color: "from-[#00C6FF] to-[#0072FF]" },
  { name: "Contacted", count: 654, percentage: 52.4, color: "from-[#00C6FF] to-[#0072FF]" },
  { name: "Meetings Scheduled", count: 423, percentage: 33.9, color: "from-[#0072FF] to-[#3b82f6]" },
  { name: "Proposals Sent", count: 287, percentage: 23.0, color: "from-[#0072FF] to-[#10b981]" },
  { name: "Converted", count: 198, percentage: 15.9, color: "from-[#10b981] to-[#059669]" },
]

export function ConversionFunnel() {
  return (
    <Card className="border border-gray-200/80 hover:border-[#00C6FF] shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardHeader className="pb-5 pt-6 px-6">
        <CardTitle className="text-xl font-semibold font-display text-[#1f2937] leading-tight mb-1.5">
          Conversion Funnel
        </CardTitle>
        <CardDescription className="text-sm text-[#6b7280] leading-relaxed">
          Lead progression through your sales pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {funnelStages.map((stage, index) => {
            const isLast = index === funnelStages.length - 1
            const dropOff = index > 0 
              ? ((funnelStages[index - 1].count - stage.count) / funnelStages[index - 1].count * 100).toFixed(1)
              : 0
            
            return (
              <div key={stage.name} className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className={`w-28 h-10 rounded-lg bg-gradient-to-r ${stage.color} flex items-center justify-center text-white font-semibold text-xs shadow-sm shrink-0`}>
                    {stage.name}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-500 ease-out flex items-center justify-end pr-2.5`}
                          style={{ width: `${stage.percentage}%` }}
                        >
                          <span className="text-[10px] font-semibold text-white leading-none">
                            {stage.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right min-w-[70px] shrink-0">
                        <div className="text-sm font-semibold text-[#1f2937] leading-tight">
                          {stage.percentage.toFixed(1)}%
                        </div>
                        {index > 0 && (
                          <div className="text-[11px] text-[#9ca3af] leading-tight mt-0.5">
                            -{dropOff}% drop
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isLast && (
                    <ChevronRight className="h-4 w-4 text-[#9ca3af] shrink-0 mx-1" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200/80">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wide mb-1.5">Overall Conversion Rate</p>
              <p className="text-2xl font-bold gradient-text leading-none">
                {((funnelStages[funnelStages.length - 1].count / funnelStages[0].count) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wide mb-1.5">Total Conversions</p>
              <p className="text-2xl font-bold text-[#1f2937] leading-none">
                {funnelStages[funnelStages.length - 1].count.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
