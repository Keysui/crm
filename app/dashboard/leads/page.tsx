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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Leads (CRM)</h2>
        <p className="text-muted-foreground">
          Manage your leads and customer relationships
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>
            View and manage all your leads in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        lead.status === "booked"
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                          : lead.status === "new"
                          ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20"
                          : ""
                      }
                    >
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-2xl">
                    {lead.sentiment || "😐"}
                  </TableCell>
                  <TableCell>{lead.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(lead)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
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
