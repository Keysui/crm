"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Phone, MessageSquare, Calendar, Zap, CheckCircle2, XCircle, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Mock workflows data
const workflows = [
  {
    id: "1",
    name: "Missed Call Text Back",
    description: "Automatically sends a follow-up SMS when a call is missed",
    icon: Phone,
    active: true,
  },
  {
    id: "2",
    name: "Review Request Sequence",
    description: "Sends review requests to customers after service completion",
    icon: MessageSquare,
    active: true,
  },
  {
    id: "3",
    name: "Appointment Reminders",
    description: "Sends reminder messages 24 hours and 2 hours before appointments",
    icon: Calendar,
    active: false,
  },
  {
    id: "4",
    name: "Welcome Message",
    description: "Sends welcome message to new leads within 5 minutes",
    icon: Zap,
    active: true,
  },
  {
    id: "5",
    name: "Follow-up Sequence",
    description: "Automated follow-up messages for leads that haven't responded",
    icon: MessageSquare,
    active: false,
  },
]

// Mock execution log data (last 50 actions)
const generateExecutionLog = () => {
  const actions = [
    { type: "sms", message: "Sent SMS to", status: "success" },
    { type: "call", message: "Initiated call to", status: "success" },
    { type: "email", message: "Sent email to", status: "success" },
    { type: "sms", message: "Sent SMS to", status: "failed" },
    { type: "webhook", message: "Triggered webhook for", status: "success" },
  ]

  const phones = [
    "+1 (555) 123-4567",
    "+1 (555) 234-5678",
    "+1 (555) 345-6789",
    "+1 (555) 456-7890",
    "+1 (555) 567-8901",
    "+1 (555) 678-9012",
    "+1 (555) 789-0123",
    "+1 (555) 890-1234",
  ]

  const log = []
  // Use a seeded random approach for consistency
  let seed = 12345
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  for (let i = 0; i < 50; i++) {
    const action = actions[Math.floor(seededRandom() * actions.length)]
    const phone = phones[Math.floor(seededRandom() * phones.length)]
    const minutesAgo = Math.floor(seededRandom() * 1440) // Random time in last 24 hours
    const time = new Date(Date.now() - minutesAgo * 60 * 1000)

    log.push({
      id: i + 1,
      action: `${action.message} ${phone}`,
      status: action.status,
      time,
    })
  }

  return log.sort((a, b) => b.time.getTime() - a.time.getTime())
}

export default function AutomationsPage() {
  const [workflowStates, setWorkflowStates] = useState(
    workflows.reduce((acc, workflow) => {
      acc[workflow.id] = workflow.active
      return acc
    }, {} as Record<string, boolean>)
  )
  const [executionLog, setExecutionLog] = useState<ReturnType<typeof generateExecutionLog>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setExecutionLog(generateExecutionLog())
  }, [])

  const handleToggle = (workflowId: string) => {
    setWorkflowStates((prev) => ({
      ...prev,
      [workflowId]: !prev[workflowId],
    }))
    // In production, this would make an API call to update the workflow status
    console.log(`Workflow ${workflowId} toggled to ${!workflowStates[workflowId]}`)
  }

  const getStatusBadge = (status: string) => {
    if (status === "success") {
      return (
        <Badge variant="outline" className="bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/15 border-[#10b981]/30 font-medium text-[11px] px-2 py-0.5 h-5">
          <CheckCircle2 className="h-3 w-3 mr-1 stroke-[2]" />
          Success
        </Badge>
      )
    } else if (status === "failed") {
      return (
        <Badge variant="outline" className="bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/15 border-[#ef4444]/30 font-medium text-[11px] px-2 py-0.5 h-5">
          <XCircle className="h-3 w-3 mr-1 stroke-[2]" />
          Failed
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-[#f59e0b]/10 text-[#f59e0b] hover:bg-[#f59e0b]/15 border-[#f59e0b]/30 font-medium text-[11px] px-2 py-0.5 h-5">
          <Clock className="h-3 w-3 mr-1 stroke-[2]" />
          Pending
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-7 animate-fade-in">
      <div className="space-y-1.5">
        <h2 className="text-3xl font-bold tracking-tight text-[#111827] leading-tight">Automations</h2>
        <p className="text-[#6b7280] text-sm leading-relaxed">
          Configure and manage your automation workflows
        </p>
      </div>

      {/* Active Workflows */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[#111827] leading-tight">Active Workflows</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => {
            const Icon = workflow.icon
            const isActive = workflowStates[workflow.id]

            return (
              <Card key={workflow.id} className="flex items-center justify-between p-4 border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-[#10b981]' : 'text-[#9ca3af]'} stroke-[2]`} />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-[#111827] mb-0.5 leading-tight">{workflow.name}</CardTitle>
                    <CardDescription className="text-xs text-[#6b7280] leading-relaxed line-clamp-2">
                      {workflow.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="ml-3 shrink-0">
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => handleToggle(workflow.id)}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Execution Log */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[#111827] leading-tight">Execution Log</h3>
        <Card className="border border-gray-200/80 shadow-sm">
          <CardHeader className="pb-4 pt-6 px-6 border-b border-gray-200/50">
            <CardTitle className="text-lg font-semibold text-[#111827] leading-tight">Last 50 Automation Actions</CardTitle>
            <CardDescription className="text-xs text-[#6b7280] leading-relaxed mt-1">
              Recent automation executions and their status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200/80 hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] h-11 px-6 text-left">Action</TableHead>
                  <TableHead className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] h-11 px-6 text-left">Status</TableHead>
                  <TableHead className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] h-11 px-6 text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mounted ? (
                  executionLog.slice(0, 20).map((log) => (
                    <TableRow key={log.id} className="border-b border-gray-200/50 hover:bg-[#f9fafb]/50 transition-colors duration-150">
                      <TableCell className="font-medium text-sm text-[#111827] py-4 px-6">{log.action}</TableCell>
                      <TableCell className="py-4 px-6">{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="text-right text-sm text-[#6b7280] py-4 px-6 font-mono text-[13px]">
                        {formatDistanceToNow(log.time, { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-sm text-[#6b7280]">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
