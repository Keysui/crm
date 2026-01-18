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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200/80 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-200/50">
          <DialogTitle className="text-xl font-semibold text-[#111827] leading-tight">{lead.name}</DialogTitle>
          <DialogDescription className="text-xs text-[#6b7280] leading-relaxed mt-1.5">
            Lead details and conversation summary
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Lead Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">Phone</p>
              <p className="text-sm font-medium text-[#111827] font-mono">{lead.phone}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">Status</p>
              <p className="text-sm font-medium text-[#111827] capitalize">{lead.status}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">Source</p>
              <p className="text-sm font-medium text-[#111827]">{lead.source}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">Date</p>
              <p className="text-sm font-medium text-[#111827] font-mono">{lead.date}</p>
            </div>
          </div>

          <Separator className="bg-gray-200/50" />

          {/* AI Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#111827] leading-tight">AI Summary</h3>
            <div className="bg-[#f9fafb] rounded-xl border border-gray-200/50 p-4">
              <p className="text-sm leading-relaxed text-[#374151]">
                {lead.aiSummary || lead.summary || "No summary available for this lead."}
              </p>
            </div>
          </div>

          {/* Audio Player (if Voice Call) */}
          {lead.source === "Voice" && (lead.recordingUrl || lead.recording_url) && (
            <>
              <Separator className="bg-gray-200/50" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#111827] leading-tight flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#6b7280] stroke-[2]" />
                  Call Recording
                </h3>
                <div className="bg-[#f9fafb] rounded-xl border border-gray-200/50 p-4 space-y-3">
                  <audio
                    controls
                    className="w-full"
                    src={lead.recordingUrl || lead.recording_url}
                  >
                    Your browser does not support the audio element.
                  </audio>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(lead.recordingUrl || lead.recording_url, "_blank")}
                      className="h-8 px-3 text-xs font-medium text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] border-gray-200/80"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5 stroke-[2]" />
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
                      className="h-8 px-3 text-xs font-medium text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] border-gray-200/80"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5 stroke-[2]" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator className="bg-gray-200/50" />

          {/* Export to HubSpot */}
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleExportToHubSpot}
              className="btn-gradient text-white border-0 shadow-sm hover:shadow-md h-9 px-4 text-sm font-semibold"
            >
              <Upload className="h-4 w-4 mr-2 stroke-[2]" />
              Export to HubSpot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
