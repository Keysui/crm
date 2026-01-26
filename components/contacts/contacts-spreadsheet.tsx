"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  jobPosition: string
  status: string
  notes: string
  plan?: string
  appointmentDate?: string
  businessName?: string
  businessPosition?: string
  createdAt: string
}

interface ContactsSpreadsheetProps {
  contacts: Contact[]
  onUpdateContact: (contact: Contact) => void
}

export function ContactsSpreadsheet({
  contacts,
  onUpdateContact,
}: ContactsSpreadsheetProps) {
  const handleCellChange = (
    contactId: string,
    field: keyof Contact,
    value: string
  ) => {
    const contact = contacts.find((c) => c.id === contactId)
    if (contact) {
      onUpdateContact({
        ...contact,
        [field]: value,
      })
    }
  }

  if (contacts.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">
          No contacts available. Add contacts to see them in the spreadsheet.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Name</TableHead>
            <TableHead className="min-w-[150px]">Phone Number</TableHead>
            <TableHead className="min-w-[200px]">Email</TableHead>
            <TableHead className="min-w-[150px]">Plan</TableHead>
            <TableHead className="min-w-[150px]">Appointment Date</TableHead>
            <TableHead className="min-w-[150px]">Business Name</TableHead>
            <TableHead className="min-w-[150px]">Business Position</TableHead>
            <TableHead className="min-w-[150px]">Company</TableHead>
            <TableHead className="min-w-[150px]">Job Position</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>
                <Input
                  value={contact.phone || ""}
                  onChange={(e) =>
                    handleCellChange(contact.id, "phone", e.target.value)
                  }
                  className="h-8 border-0 bg-transparent p-0 focus-visible:ring-1"
                  placeholder="Phone"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={contact.email || ""}
                  onChange={(e) =>
                    handleCellChange(contact.id, "email", e.target.value)
                  }
                  className="h-8 border-0 bg-transparent p-0 focus-visible:ring-1"
                  placeholder="Email"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={contact.plan || ""}
                  onChange={(e) =>
                    handleCellChange(contact.id, "plan", e.target.value)
                  }
                  className="h-8 border-0 bg-transparent p-0 focus-visible:ring-1"
                  placeholder="Plan"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={
                    contact.appointmentDate
                      ? new Date(contact.appointmentDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleCellChange(
                      contact.id,
                      "appointmentDate",
                      e.target.value
                    )
                  }
                  className="h-8 border-0 bg-transparent p-0 focus-visible:ring-1"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={contact.businessName || ""}
                  onChange={(e) =>
                    handleCellChange(contact.id, "businessName", e.target.value)
                  }
                  className="h-8 border-0 bg-transparent p-0 focus-visible:ring-1"
                  placeholder="Business Name"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={contact.businessPosition || ""}
                  onChange={(e) =>
                    handleCellChange(
                      contact.id,
                      "businessPosition",
                      e.target.value
                    )
                  }
                  className="h-8 border-0 bg-transparent p-0 focus-visible:ring-1"
                  placeholder="Business Position"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={contact.company || ""}
                  onChange={(e) =>
                    handleCellChange(contact.id, "company", e.target.value)
                  }
                  className="h-8 border-0 bg-transparent p-0 focus-visible:ring-1"
                  placeholder="Company"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={contact.jobPosition || ""}
                  onChange={(e) =>
                    handleCellChange(contact.id, "jobPosition", e.target.value)
                  }
                  className="h-8 border-0 bg-transparent p-0 focus-visible:ring-1"
                  placeholder="Job Position"
                />
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    contact.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : contact.status === "Inactive"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {contact.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
