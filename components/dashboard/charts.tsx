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
    <Card>
      <CardHeader>
        <CardTitle>Inbound Calls vs Leads</CardTitle>
        <CardDescription>
          Comparison of inbound calls and leads generated over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="inbound" fill="#8884d8" name="Inbound Calls" />
            <Bar dataKey="leads" fill="#82ca9d" name="Leads" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
