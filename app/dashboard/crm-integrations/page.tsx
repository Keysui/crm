"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  Plus,
  Plug,
  ExternalLink,
  Calendar,
  TrendingUp,
  AlertCircle,
  Check,
} from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface CrmIntegration {
  id: string
  name: string
  description: string
  logo: string
  status: "connected" | "disconnected" | "syncing" | "error"
  lastSynced: string | null
  recordsSynced: number
  errors: number
  syncFrequency: "realtime" | "hourly" | "daily"
  connectedAt: string | null
  apiKey?: string
}

const availableCrms: CrmIntegration[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Connect and sync leads, contacts, and deals with HubSpot CRM",
    logo: "H",
    status: "connected",
    lastSynced: "2 minutes ago",
    recordsSynced: 1245,
    errors: 0,
    syncFrequency: "realtime",
    connectedAt: "2024-01-15",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Integrate with Salesforce to sync accounts, contacts, and opportunities",
    logo: "S",
    status: "disconnected",
    lastSynced: null,
    recordsSynced: 0,
    errors: 0,
    syncFrequency: "hourly",
    connectedAt: null,
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Sync leads and deals with your Pipedrive sales pipeline",
    logo: "P",
    status: "disconnected",
    lastSynced: null,
    recordsSynced: 0,
    errors: 0,
    syncFrequency: "hourly",
    connectedAt: null,
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    description: "Connect with Zoho CRM to sync contacts, leads, and accounts",
    logo: "Z",
    status: "disconnected",
    lastSynced: null,
    recordsSynced: 0,
    errors: 0,
    syncFrequency: "hourly",
    connectedAt: null,
  },
  {
    id: "monday",
    name: "Monday.com",
    description: "Sync leads and activities with Monday.com boards",
    logo: "M",
    status: "error",
    lastSynced: "1 hour ago",
    recordsSynced: 87,
    errors: 3,
    syncFrequency: "hourly",
    connectedAt: "2024-01-10",
  },
]

// Mock sync history
const generateSyncHistory = () => {
  const history = []
  const statuses = ["success", "success", "success", "error", "success"]
  const syncTypes = ["Full Sync", "Incremental Sync", "Contact Update", "Lead Creation", "Deal Update"]
  
  for (let i = 0; i < 20; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const syncType = syncTypes[Math.floor(Math.random() * syncTypes.length)]
    const minutesAgo = Math.floor(Math.random() * 1440)
    const time = new Date(Date.now() - minutesAgo * 60 * 1000)
    
    history.push({
      id: i + 1,
      crm: "HubSpot",
      type: syncType,
      status,
      records: Math.floor(Math.random() * 100) + 1,
      time,
    })
  }
  
  return history.sort((a, b) => b.time.getTime() - a.time.getTime())
}

export default function CrmIntegrationsPage() {
  const [integrations, setIntegrations] = useState<CrmIntegration[]>(availableCrms)
  const [selectedIntegration, setSelectedIntegration] = useState<CrmIntegration | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [syncHistory, setSyncHistory] = useState<ReturnType<typeof generateSyncHistory>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSyncHistory(generateSyncHistory())
  }, [])

  const getStatusBadge = (status: CrmIntegration["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-[#10b981] text-white border-0">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "disconnected":
        return (
          <Badge className="bg-[#6b7280] text-white border-0">
            Disconnected
          </Badge>
        )
      case "syncing":
        return (
          <Badge className="bg-[#f59e0b] text-white border-0 animate-pulse">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Syncing
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-[#ef4444] text-white border-0">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
    }
  }

  const handleConnect = (integration: CrmIntegration) => {
    setSelectedIntegration(integration)
    setApiKey("")
    setIsDialogOpen(true)
  }

  const handleConfirmConnect = () => {
    if (!selectedIntegration || !apiKey.trim()) {
      toast.error("Please enter an API key")
      return
    }

    setIsConnecting(true)
    toast.info(`Connecting to ${selectedIntegration.name}...`)

    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === selectedIntegration.id
            ? {
                ...integration,
                status: "connected" as const,
                lastSynced: "just now",
                recordsSynced: 0,
                errors: 0,
                connectedAt: new Date().toISOString(),
                apiKey: apiKey,
              }
            : integration
        )
      )
      setIsDialogOpen(false)
      setIsConnecting(false)
      setApiKey("")
      toast.success(`${selectedIntegration.name} connected successfully!`)
    }, 2000)
  }

  const handleDisconnect = (id: string) => {
    const integration = integrations.find((i) => i.id === id)
    if (integration) {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: "disconnected" as const,
                lastSynced: null,
                connectedAt: null,
                apiKey: undefined,
              }
            : i
        )
      )
      toast.success(`${integration.name} disconnected`)
    }
  }

  const handleSync = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, status: "syncing" as const, lastSynced: "Syncing..." }
          : integration
      )
    )
    toast.info(`Syncing ${integrations.find((i) => i.id === id)?.name}...`)

    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === id
            ? {
                ...integration,
                status: "connected" as const,
                lastSynced: "just now",
                recordsSynced: integration.recordsSynced + Math.floor(Math.random() * 50) + 10,
                errors: 0,
              }
            : integration
        )
      )
      toast.success(`${integrations.find((i) => i.id === id)?.name} sync completed!`)
    }, 2000)
  }

  const handleReconnect = (id: string) => {
    const integration = integrations.find((i) => i.id === id)
    if (integration) {
      handleConnect(integration)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-display">
            CRM Integrations
          </h1>
          <p className="text-[#4b5563] text-lg mt-1">
            Connect and sync data with your favorite CRM systems
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-xl">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Available Integrations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className="border border-gray-200 hover:border-[#00C6FF] shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#00C6FF] to-[#0072FF] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {integration.logo}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-[#1f2937]">
                      {integration.name}
                    </CardTitle>
                    {getStatusBadge(integration.status)}
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm text-[#4b5563] mt-2">
                {integration.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integration.status === "connected" && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-[#4b5563]">
                    <span>Last synced:</span>
                    <span className="font-medium text-[#1f2937]">{integration.lastSynced}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#4b5563]">
                    <span>Records synced:</span>
                    <span className="font-medium text-[#1f2937]">
                      {integration.recordsSynced.toLocaleString()}
                    </span>
                  </div>
                  {integration.errors > 0 && (
                    <div className="flex items-center justify-between text-[#ef4444]">
                      <span>Errors:</span>
                      <span className="font-medium">{integration.errors}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                {integration.status === "connected" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-xl border-[#00C6FF] text-[#0072FF] hover:bg-[#00C6FF]/10"
                      onClick={() => handleSync(integration.id)}
                      disabled={integration.status === "syncing"}
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${
                          integration.status === "syncing" ? "animate-spin" : ""
                        }`}
                      />
                      Sync Now
                    </Button>
                    <Link href={`/dashboard/crm-integrations/${integration.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        title="Settings"
                      >
                        <Settings className="h-4 w-4 stroke-[2]" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      Disconnect
                    </Button>
                  </>
                )}
                {integration.status === "disconnected" && (
                  <Button
                    size="sm"
                    className="flex-1 btn-gradient text-white border-0 rounded-xl"
                    onClick={() => handleConnect(integration)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
                {integration.status === "error" && (
                  <Button
                    size="sm"
                    className="flex-1 bg-[#ef4444] text-white hover:bg-[#dc2626] rounded-xl"
                    onClick={() => handleReconnect(integration.id)}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Reconnect
                  </Button>
                )}
                {integration.status === "syncing" && (
                  <Button size="sm" variant="outline" className="flex-1 rounded-xl" disabled>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync History */}
      {integrations.some((i) => i.status === "connected") && (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1f2937]">Sync History</CardTitle>
            <CardDescription className="text-sm text-[#4b5563]">
              Recent synchronization activities across all connected CRM systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#4b5563]">Time</TableHead>
                  <TableHead className="text-[#4b5563]">CRM System</TableHead>
                  <TableHead className="text-[#4b5563]">Type</TableHead>
                  <TableHead className="text-[#4b5563]">Records</TableHead>
                  <TableHead className="text-[#4b5563]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mounted ? (
                  syncHistory.slice(0, 10).map((item) => (
                    <TableRow key={item.id} className="hover:bg-[#f9fafb]">
                      <TableCell className="text-sm text-[#4b5563]">
                        {formatDistanceToNow(item.time, { addSuffix: true })}
                      </TableCell>
                      <TableCell className="font-medium text-[#1f2937]">{item.crm}</TableCell>
                      <TableCell className="text-sm text-[#4b5563]">{item.type}</TableCell>
                      <TableCell className="text-sm text-[#4b5563]">{item.records}</TableCell>
                      <TableCell>
                        {item.status === "success" ? (
                          <Badge className="bg-[#10b981] text-white border-0">
                            <Check className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        ) : (
                          <Badge className="bg-[#ef4444] text-white border-0">
                            <XCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-sm text-[#6b7280]">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Connection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#1f2937]">
              Connect {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription className="text-[#4b5563]">
              {selectedIntegration?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-[#1f2937]">
                API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="rounded-xl"
              />
              <p className="text-xs text-[#6b7280]">
                Your API key is encrypted and stored securely
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={handleConfirmConnect}
                disabled={isConnecting || !apiKey.trim()}
                className="flex-1 btn-gradient text-white border-0 rounded-xl"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}