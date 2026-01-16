"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

const funnelStages = [
  { name: "Leads Generated", count: 1247, percentage: 100, color: "from-[#00E0FF] to-[#00C6FF]" },
  { name: "Qualified", count: 892, percentage: 71.5, color: "from-[#00C6FF] to-[#0072FF]" },
  { name: "Contacted", count: 654, percentage: 52.4, color: "from-[#00C6FF] to-[#0072FF]" },
  { name: "Meeting Scheduled", count: 423, percentage: 33.9, color: "from-[#0072FF] to-[#3b82f6]" },
  { name: "Proposal Sent", count: 287, percentage: 23.0, color: "from-[#0072FF] to-[#10b981]" },
  { name: "Converted", count: 198, percentage: 15.9, color: "from-[#10b981] to-[#059669]" },
]

export function ConversionFunnel() {
  return (
    <Card className="border border-gray-200 hover:border-[#00C6FF] shadow-sm hover:shadow-lg hover-lift transition-all duration-300 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold font-display text-[#1f2937]">Conversion Funnel</CardTitle>
        <CardDescription className="text-sm text-[#4b5563]">
          Lead progression through your sales pipeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelStages.map((stage, index) => {
            const isLast = index === funnelStages.length - 1
            const dropOff = index > 0 
              ? ((funnelStages[index - 1].count - stage.count) / funnelStages[index - 1].count * 100).toFixed(1)
              : 0
            
            return (
              <div key={stage.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-32 h-12 rounded-xl bg-gradient-to-r ${stage.color} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
                      {stage.name}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                            style={{ width: `${stage.percentage}%` }}
                          >
                            <span className="text-xs font-semibold text-white">
                              {stage.count.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <div className="text-sm font-semibold text-[#1f2937]">
                            {stage.percentage.toFixed(1)}%
                          </div>
                          {index > 0 && (
                            <div className="text-xs text-[#9ca3af]">
                              -{dropOff}% drop
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isLast && (
                    <ChevronRight className="h-5 w-5 text-[#9ca3af] mx-2 shrink-0" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4b5563]">Overall Conversion Rate</p>
              <p className="text-2xl font-bold gradient-text mt-1">
                {((funnelStages[funnelStages.length - 1].count / funnelStages[0].count) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#4b5563]">Total Conversions</p>
              <p className="text-2xl font-bold text-[#1f2937] mt-1">
                {funnelStages[funnelStages.length - 1].count.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
