"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { LeadDetailsDialog } from "@/components/leads/lead-details-dialog"

// Mock data - in production, this would come from your database
const mockLeads = [
  {
    id: "1",
    name: "John Smith",
    phone: "(555) 123-4567",
    status: "booked",
    sentiment: "😊",
    date: "2024-01-15",
    source: "Voice" as const,
    summary: "Interested in premium package",
    aiSummary: "Customer called to inquire about our premium service package. Expressed strong interest in the features and pricing. Booked a demo for next week. Very positive interaction, customer seems ready to convert.",
    recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "(555) 234-5678",
    status: "new",
    sentiment: "😐",
    date: "2024-01-14",
    source: "SMS" as const,
    summary: "Requested information via text",
    aiSummary: "Customer sent SMS requesting more information about our services. Asked about pricing and availability. Responded with automated message containing pricing details. Waiting for follow-up.",
  },
  {
    id: "3",
    name: "Mike Davis",
    phone: "(555) 345-6789",
    status: "booked",
    sentiment: "😊",
    date: "2024-01-14",
    source: "Voice" as const,
    summary: "Scheduled consultation call",
    aiSummary: "Customer called to schedule a consultation. Discussed their business needs and how our solution can help. Booked a 30-minute consultation call for tomorrow. Customer was very engaged and asked detailed questions.",
    recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "4",
    name: "Emily Chen",
    phone: "(555) 456-7890",
    status: "new",
    sentiment: "😊",
    date: "2024-01-13",
    source: "Voice" as const,
    summary: "Interested in enterprise plan",
    aiSummary: "Customer called asking about enterprise pricing. Very interested in our solution for their team of 50+ employees. Requested a custom quote. Positive sentiment throughout the call.",
    recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "5",
    name: "Robert Wilson",
    phone: "(555) 567-8901",
    status: "new",
    sentiment: "😐",
    date: "2024-01-13",
    source: "SMS" as const,
    summary: "General inquiry",
    aiSummary: "Customer sent SMS with general questions about our services. Provided automated response with FAQ links. Customer has not responded yet.",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    phone: "(555) 678-9012",
    status: "booked",
    sentiment: "😊",
    date: "2024-01-12",
    source: "Voice" as const,
    summary: "Demo scheduled successfully",
    aiSummary: "Customer called to book a demo. Very enthusiastic about our product. Scheduled demo for next week. Customer mentioned they've been looking for a solution like ours for months.",
    recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
]

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<typeof mockLeads[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleViewDetails = (lead: typeof mockLeads[0]) => {
    setSelectedLead(lead)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5">
        <h2 className="text-3xl font-bold tracking-tight text-[#111827] leading-tight">Leads (CRM)</h2>
        <p className="text-[#6b7280] text-sm leading-relaxed">
          Manage your leads and customer relationships
        </p>
      </div>

      <Card className="border border-gray-200/80 shadow-sm bg-white">
        <CardHeader className="pb-4 pt-6 px-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-[#111827] leading-tight">All Leads</CardTitle>
              <CardDescription className="text-xs text-[#6b7280] leading-relaxed mt-1">
                View and manage all your leads in one place
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200/80 hover:bg-transparent">
                <TableHead className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] h-11 px-6 text-left">Name</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] h-11 px-6 text-left">Phone</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] h-11 px-6 text-left">Status</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] h-11 px-6 text-center">Sentiment</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] h-11 px-6 text-left">Date</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.05em] h-11 px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeads.map((lead) => (
                <TableRow key={lead.id} className="border-b border-gray-200/50 hover:bg-[#f9fafb]/50 transition-colors duration-150">
                  <TableCell className="font-medium text-sm text-[#111827] py-4 px-6">{lead.name}</TableCell>
                  <TableCell className="text-sm text-[#6b7280] py-4 px-6 font-mono tracking-tight">{lead.phone}</TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge
                      variant="outline"
                      className={
                        lead.status === "booked"
                          ? "bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/15 border-[#10b981]/30 font-medium text-[11px] px-2 py-0.5 h-5"
                          : lead.status === "new"
                          ? "bg-[#f59e0b]/10 text-[#f59e0b] hover:bg-[#f59e0b]/15 border-[#f59e0b]/30 font-medium text-[11px] px-2 py-0.5 h-5"
                          : "font-medium text-[11px] px-2 py-0.5 h-5"
                      }
                    >
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-lg text-center py-4 px-6 align-middle">{lead.sentiment || "😐"}</TableCell>
                  <TableCell className="text-sm text-[#6b7280] py-4 px-6 font-mono text-[13px]">{lead.date}</TableCell>
                  <TableCell className="text-right py-4 px-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(lead)}
                      className="h-7 px-2.5 text-xs font-medium text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5 stroke-[2]" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <LeadDetailsDialog
        lead={selectedLead}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
