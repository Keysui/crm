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
    <Card className="border border-gray-200 hover:border-[#00C6FF] shadow-sm hover:shadow-lg hover-lift transition-all duration-300 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold font-display text-[#1f2937]">Leads Over Time</CardTitle>
        <CardDescription className="text-sm text-[#4b5563]">
          Comparison of inbound calls and leads generated over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              tick={{ fill: "#4b5563" }}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              tick={{ fill: "#4b5563" }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                padding: "12px",
              }}
              labelStyle={{ color: "#1f2937", fontWeight: 600 }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
            />
            <Bar 
              dataKey="inbound" 
              fill="#00C6FF" 
              name="Inbound Calls"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="leads" 
              fill="#0072FF" 
              name="Leads Generated"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
