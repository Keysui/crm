"use client"

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
          <Badge className="bg-[#10b981] text-white border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "syncing":
        return (
          <Badge className="bg-[#f59e0b] text-white border-0">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Syncing
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="border border-gray-200 hover:border-[#00C6FF] shadow-sm hover:shadow-lg hover-lift transition-all duration-300 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold font-display text-[#1f2937]">
              CRM Integrations
            </CardTitle>
            <CardDescription className="text-sm text-[#4b5563]">
              Connected systems and sync status
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="btn-gradient text-white border-0 rounded-full px-4 h-8 text-xs font-semibold"
          >
            <Plus className="h-3 w-3 mr-1" />
            Connect
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#4b5563] mb-4">No CRM systems connected</p>
            <Button className="btn-gradient text-white border-0 rounded-full">
              Connect Your CRM
            </Button>
          </div>
        ) : (
          <>
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#00C6FF] transition-all duration-200 bg-[#f9fafb]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {connection.logo}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1f2937] text-sm">
                        {connection.name}
                      </h4>
                      <p className="text-xs text-[#9ca3af]">
                        Last synced: {connection.lastSync}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(connection.status)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#4b5563]">Records synced today</p>
                    <p className="text-sm font-semibold text-[#1f2937]">
                      {connection.recordsSynced.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 text-xs"
                      onClick={() => handleSync(connection.id)}
                      disabled={connection.status === "syncing"}
                    >
                      <RefreshCw
                        className={`h-3 w-3 mr-1 ${connection.status === "syncing" ? "animate-spin" : ""}`}
                      />
                      Sync
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 text-xs"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-[#00C6FF] text-[#0072FF] hover:bg-[#00C6FF]/10 rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Another CRM
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
