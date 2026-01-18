"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, RefreshCw, Settings, Plus } from "lucide-react"
import { useState } from "react"

interface CRMConnection {
  id: string
  name: string
  logo: string
  status: "connected" | "syncing" | "error"
  lastSync: string
  recordsSynced: number
}

const mockConnections: CRMConnection[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    logo: "H",
    status: "connected",
    lastSync: "2 minutes ago",
    recordsSynced: 1247,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    logo: "S",
    status: "syncing",
    lastSync: "Syncing...",
    recordsSynced: 892,
  },
]

export function CRMIntegrationWidget() {
  const [connections, setConnections] = useState<CRMConnection[]>(mockConnections)

  const handleSync = (id: string) => {
    setConnections(prev =>
      prev.map(conn =>
        conn.id === id ? { ...conn, status: "syncing" as const, lastSync: "Syncing..." } : conn
      )
    )
    // Simulate sync completion
    setTimeout(() => {
      setConnections(prev =>
        prev.map(conn =>
          conn.id === id
            ? { ...conn, status: "connected" as const, lastSync: "Just now" }
            : conn
        )
      )
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-[#10b981] text-white border-0 text-[10px] font-semibold px-2 py-0.5 h-5">
            <CheckCircle2 className="h-3 w-3 mr-1 stroke-[2.5]" />
            Connected
          </Badge>
        )
      case "syncing":
        return (
          <Badge className="bg-[#f59e0b] text-white border-0 text-[10px] font-semibold px-2 py-0.5 h-5">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin stroke-[2.5]" />
            Syncing
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive" className="text-[10px] font-semibold px-2 py-0.5 h-5">
            <XCircle className="h-3 w-3 mr-1 stroke-[2.5]" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="border border-gray-200/80 hover:border-[#00C6FF] shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardHeader className="pb-5 pt-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold font-display text-[#1f2937] leading-tight mb-1.5">
              CRM Integrations
            </CardTitle>
            <CardDescription className="text-sm text-[#6b7280] leading-relaxed">
              Connected systems and sync status
            </CardDescription>
          </div>
          <Link href="/dashboard/crm-integrations">
            <Button
              size="sm"
              className="btn-gradient text-white border-0 rounded-lg px-3.5 h-8 text-xs font-semibold shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5 stroke-[2.5]" />
              Connect
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-3">
        {connections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#6b7280] mb-4 leading-relaxed">No CRM systems connected</p>
            <Link href="/dashboard/crm-integrations">
              <Button className="btn-gradient text-white border-0 rounded-lg shadow-sm hover:shadow-md">
                Connect Your CRM
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="p-4 rounded-xl border border-gray-200/80 hover:border-[#00C6FF] transition-all duration-200 bg-[#f9fafb]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                      {connection.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-[#1f2937] text-sm leading-tight mb-0.5">
                        {connection.name}
                      </h4>
                      <p className="text-[11px] text-[#9ca3af] leading-tight">
                        Last synced: {connection.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 ml-2">
                    {getStatusBadge(connection.status)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-[#6b7280] uppercase tracking-wide mb-0.5">Records synced today</p>
                    <p className="text-sm font-semibold text-[#1f2937] leading-tight">
                      {connection.recordsSynced.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2.5 text-xs font-medium hover:bg-[#f3f4f6]"
                      onClick={() => handleSync(connection.id)}
                      disabled={connection.status === "syncing"}
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 mr-1.5 stroke-[2.5] ${connection.status === "syncing" ? "animate-spin" : ""}`}
                      />
                      Sync
                    </Button>
                    <Link href={`/dashboard/crm-integrations/${connection.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 hover:bg-[#f3f4f6]"
                      >
                        <Settings className="h-3.5 w-3.5 stroke-[2.5]" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/dashboard/crm-integrations" className="w-full block">
              <Button
                variant="outline"
                className="w-full border-[#00C6FF]/50 text-[#0072FF] hover:bg-[#00C6FF]/10 hover:border-[#00C6FF] rounded-xl h-9 text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5 mr-2 stroke-[2.5]" />
                Connect Another CRM
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}
