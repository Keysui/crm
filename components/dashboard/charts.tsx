"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", inbound: 400, leads: 240 },
  { name: "Feb", inbound: 300, leads: 139 },
  { name: "Mar", inbound: 200, leads: 980 },
  { name: "Apr", inbound: 278, leads: 390 },
  { name: "May", inbound: 189, leads: 480 },
  { name: "Jun", inbound: 239, leads: 380 },
]

export function CallsVsLeadsChart() {
  return (
    <Card className="border border-gray-200/80 hover:border-[#00C6FF] shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardHeader className="pb-5 pt-6 px-6">
        <CardTitle className="text-xl font-semibold font-display text-[#1f2937] leading-tight mb-1.5">
          Leads Over Time
        </CardTitle>
        <CardDescription className="text-sm text-[#6b7280] leading-relaxed">
          Comparison of inbound calls and leads generated over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={11}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
              tickMargin={8}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={11}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
              tickMargin={8}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.08)",
                padding: "10px 12px",
              }}
              labelStyle={{ 
                color: "#1f2937", 
                fontWeight: 600,
                fontSize: "12px",
                marginBottom: "4px"
              }}
              itemStyle={{
                fontSize: "12px",
                padding: "2px 0"
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "24px", fontSize: "12px" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar 
              dataKey="inbound" 
              fill="#00C6FF" 
              name="Inbound Calls"
              radius={[6, 6, 0, 0]}
            />
            <Bar 
              dataKey="leads" 
              fill="#0072FF" 
              name="Leads Generated"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
