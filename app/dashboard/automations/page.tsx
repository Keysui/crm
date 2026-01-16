"use client"

import { useState } from "react"
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
  for (let i = 0; i < 50; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const phone = phones[Math.floor(Math.random() * phones.length)]
    const minutesAgo = Math.floor(Math.random() * 1440) // Random time in last 24 hours
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

const executionLog = generateExecutionLog()

export default function AutomationsPage() {
  const [workflowStates, setWorkflowStates] = useState(
    workflows.reduce((acc, workflow) => {
      acc[workflow.id] = workflow.active
      return acc
    }, {} as Record<string, boolean>)
  )

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
        <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Success
        </Badge>
      )
    } else if (status === "failed") {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Automations</h2>
        <p className="text-muted-foreground">
          Configure and manage your automation workflows
        </p>
      </div>

      {/* Active Workflows */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Workflows</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => {
            const Icon = workflow.icon
            const isActive = workflowStates[workflow.id]

            return (
              <Card key={workflow.id} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative">
                    <Icon className="h-6 w-6 text-primary" />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1">{workflow.name}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {workflow.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="ml-4">
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
      <div>
        <h3 className="text-lg font-semibold mb-4">Execution Log</h3>
        <Card>
          <CardHeader>
            <CardTitle>Last 50 Automation Actions</CardTitle>
            <CardDescription>
              Recent automation executions and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executionLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDistanceToNow(log.time, { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
