"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Key,
  Trash2,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface CrmIntegration {
  id: string
  name: string
  description: string
  status: "connected" | "disconnected" | "syncing" | "error"
  lastSynced: string | null
  recordsSynced: number
  errors: number
  apiKey?: string
}

const availableCrms: CrmIntegration[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Connect and sync leads, contacts, and deals with HubSpot CRM",
    status: "connected",
    lastSynced: "2 minutes ago",
    recordsSynced: 1245,
    errors: 0,
    apiKey: "pk_live_***********1234",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Integrate with Salesforce to sync accounts, contacts, and opportunities",
    status: "disconnected",
    lastSynced: null,
    recordsSynced: 0,
    errors: 0,
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description: "Sync leads and deals with your Pipedrive sales pipeline",
    status: "disconnected",
    lastSynced: null,
    recordsSynced: 0,
    errors: 0,
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    description: "Connect with Zoho CRM to sync contacts, leads, and accounts",
    status: "disconnected",
    lastSynced: null,
    recordsSynced: 0,
    errors: 0,
  },
  {
    id: "monday",
    name: "Monday.com",
    description: "Sync leads and activities with Monday.com boards",
    status: "error",
    lastSynced: "1 hour ago",
    recordsSynced: 87,
    errors: 3,
  },
]

export default function CrmIntegrationSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const crmId = params.id as string

  const [integration, setIntegration] = useState<CrmIntegration | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const found = availableCrms.find((crm) => crm.id === crmId)
    if (found) {
      setIntegration(found)
      if (found.apiKey) {
        // Extract the last 4 characters if API key is masked
        const maskedKey = found.apiKey.replace(/[^-*]/g, "*")
        setApiKey(maskedKey)
      }
    }
  }, [crmId])

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key")
      return
    }

    setIsSaving(true)
    toast.info(`Updating ${integration?.name} settings...`)

    setTimeout(() => {
      setIsSaving(false)
      setIntegration((prev) =>
        prev
          ? {
              ...prev,
              apiKey: apiKey.replace(/\*/g, "•").slice(0, -4) + apiKey.slice(-4),
              status: "connected" as const,
              lastSynced: "just now",
            }
          : null
      )
      toast.success(`${integration?.name} settings updated successfully!`)
    }, 1500)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    toast.info(`Disconnecting ${integration?.name}...`)

    setTimeout(() => {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      toast.success(`${integration?.name} has been disconnected`)
      router.push("/dashboard/crm-integrations")
    }, 1500)
  }

  if (!integration) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-[#6b7280] mx-auto" />
          <h2 className="text-xl font-semibold text-[#111827]">CRM Integration Not Found</h2>
          <p className="text-sm text-[#6b7280]">The requested CRM integration could not be found.</p>
          <Link href="/dashboard/crm-integrations">
            <Button variant="outline">Back to CRM Integrations</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: CrmIntegration["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-[#10b981] text-white border-0">
            <CheckCircle2 className="h-3 w-3 mr-1 stroke-[2]" />
            Connected
          </Badge>
        )
      case "disconnected":
        return (
          <Badge className="bg-[#6b7280] text-white border-0">Disconnected</Badge>
        )
      case "syncing":
        return (
          <Badge className="bg-[#f59e0b] text-white border-0 animate-pulse">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin stroke-[2]" />
            Syncing
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-[#ef4444] text-white border-0">
            <XCircle className="h-3 w-3 mr-1 stroke-[2]" />
            Error
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/crm-integrations">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4 stroke-[2]" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111827] leading-tight">
              {integration.name} Settings
            </h1>
            <p className="text-sm text-[#6b7280] leading-relaxed mt-1">
              Manage your {integration.name} integration configuration
            </p>
          </div>
        </div>
        {getStatusBadge(integration.status)}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main Settings */}
        <Card className="border border-gray-200/80 shadow-sm">
          <CardHeader className="pb-4 pt-6 px-6 border-b border-gray-200/50">
            <CardTitle className="text-lg font-semibold text-[#111827] leading-tight">
              Integration Settings
            </CardTitle>
            <CardDescription className="text-xs text-[#6b7280] leading-relaxed mt-1">
              Configure your {integration.name} API connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-[#111827]">
                Description
              </Label>
              <p className="text-sm text-[#6b7280] leading-relaxed">{integration.description}</p>
            </div>

            <Separator className="bg-gray-200/50" />

            <div className="space-y-3">
              <Label htmlFor="api-key" className="text-sm font-semibold text-[#111827] flex items-center gap-2">
                <Key className="h-4 w-4 text-[#6b7280] stroke-[2]" />
                API Key
              </Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10 h-11 border-gray-200/80 focus:ring-2 focus:ring-[#00C6FF]/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4 text-[#6b7280] stroke-[2]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#6b7280] stroke-[2]" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Your API key is encrypted and stored securely. Only the last 4 characters are visible.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !apiKey.trim()}
                className="btn-gradient text-white border-0 shadow-sm hover:shadow-md h-10 px-6 text-sm font-semibold"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin stroke-[2]" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2 stroke-[2]" />
                    Save Changes
                  </>
                )}
              </Button>
              <Link href="/dashboard/crm-integrations">
                <Button variant="outline" className="h-10 px-6 text-sm font-medium border-gray-200/80">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Status & Info Card */}
        <Card className="border border-gray-200/80 shadow-sm h-fit">
          <CardHeader className="pb-4 pt-6 px-6 border-b border-gray-200/50">
            <CardTitle className="text-lg font-semibold text-[#111827] leading-tight">
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-6">
            <div className="space-y-4">
              {integration.lastSynced && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    Last Synced
                  </p>
                  <p className="text-sm font-medium text-[#111827]">{integration.lastSynced}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">
                  Records Synced
                </p>
                <p className="text-sm font-medium text-[#111827]">
                  {integration.recordsSynced.toLocaleString()}
                </p>
              </div>

              {integration.errors > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    Errors
                  </p>
                  <p className="text-sm font-medium text-[#ef4444]">{integration.errors}</p>
                </div>
              )}

              <Separator className="bg-gray-200/50" />

              <div className="pt-2">
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full h-10 text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  <Trash2 className="h-4 w-4 mr-2 stroke-[2]" />
                  Delete Integration
                </Button>
                <p className="text-xs text-[#6b7280] text-center mt-2 leading-relaxed">
                  This will permanently disconnect {integration.name} and remove all sync settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-gray-200/80">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#111827] leading-tight">
              Delete Integration?
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6b7280] leading-relaxed mt-1.5">
              Are you sure you want to disconnect {integration.name}? This action cannot be undone
              and will remove all sync configurations.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 h-10 text-sm font-semibold"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin stroke-[2]" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2 stroke-[2]" />
                  Delete
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 h-10 text-sm font-medium border-gray-200/80"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
