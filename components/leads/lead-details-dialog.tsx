"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Phone, Download, ExternalLink, Upload } from "lucide-react"

interface Lead {
  id: string
  name: string
  phone: string
  status: string
  sentiment: string
  date: string
  source: "Voice" | "SMS"
  summary?: string
  aiSummary?: string
  recordingUrl?: string
  recording_url?: string
}

interface LeadDetailsDialogProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadDetailsDialog({
  lead,
  open,
  onOpenChange,
}: LeadDetailsDialogProps) {
  const handleExportToHubSpot = () => {
    // Placeholder function
    console.log("Exporting to HubSpot:", lead?.id)
    alert("Export to HubSpot functionality coming soon!")
  }

  if (!lead) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
          <DialogDescription>
            Lead details and conversation summary
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{lead.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-sm capitalize">{lead.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Source</p>
              <p className="text-sm">{lead.source}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-sm">{lead.date}</p>
            </div>
          </div>

          <Separator />

          {/* AI Summary */}
          <div>
            <h3 className="text-sm font-semibold mb-2">AI Summary</h3>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                {lead.aiSummary || lead.summary || "No summary available for this lead."}
              </p>
            </div>
          </div>

          {/* Audio Player (if Voice Call) */}
          {lead.source === "Voice" && (lead.recordingUrl || lead.recording_url) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call Recording
                </h3>
                <div className="bg-muted rounded-lg p-4">
                  <audio
                    controls
                    className="w-full mb-3"
                    src={lead.recordingUrl || lead.recording_url}
                  >
                    Your browser does not support the audio element.
                  </audio>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(lead.recordingUrl || lead.recording_url, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open in new tab
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = lead.recordingUrl || lead.recording_url!
                        link.download = `call-recording-${lead.name}-${lead.id}.mp3`
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Export to HubSpot */}
          <div className="flex justify-end">
            <Button onClick={handleExportToHubSpot}>
              <Upload className="h-4 w-4 mr-2" />
              Export to HubSpot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
