"use client"

import { useState } from "react"
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

const columns = [
  { key: "name", label: "Name", width: 150 },
  { key: "phone", label: "Phone Number", width: 150 },
  { key: "email", label: "Email", width: 200 },
  { key: "plan", label: "Plan", width: 150 },
  { key: "appointmentDate", label: "Appointment Date", width: 150 },
  { key: "businessName", label: "Business Name", width: 150 },
  { key: "businessPosition", label: "Business Position", width: 150 },
  { key: "company", label: "Company", width: 150 },
  { key: "jobPosition", label: "Job Position", width: 150 },
  { key: "status", label: "Status", width: 100 },
]

const columnLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

export function ContactsSpreadsheet({
  contacts,
  onUpdateContact,
}: ContactsSpreadsheetProps) {
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number
    field: keyof Contact
  } | null>(null)

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

  const handleCellClick = (rowIndex: number, field: keyof Contact) => {
    setEditingCell({ rowIndex, field })
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  if (contacts.length === 0) {
    return (
      <div className="border border-gray-300 rounded p-12 text-center bg-white">
        <p className="text-muted-foreground">
          No contacts available. Add contacts to see them in the spreadsheet.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded overflow-hidden bg-white">
      <div className="overflow-auto max-h-[calc(100vh-300px)]">
        {/* Column Headers with Letters */}
        <div className="flex sticky top-0 z-10 bg-gray-100 border-b-2 border-gray-400">
          {/* Row Number Header */}
          <div className="w-12 h-8 flex items-center justify-center border-r border-gray-300 bg-gray-200 text-xs font-semibold text-gray-600 shrink-0">
            #
          </div>
          {/* Column Headers */}
          {columns.map((col, idx) => (
            <div
              key={col.key}
              className="h-8 flex items-center justify-center border-r border-gray-300 bg-gray-100 text-xs font-semibold text-gray-700 px-2 shrink-0"
              style={{ width: col.width }}
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-500">{columnLetters[idx]}</span>
                <span>{col.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {contacts.map((contact, rowIndex) => (
          <div
            key={contact.id}
            className="flex border-b border-gray-300 hover:bg-blue-50 transition-colors"
          >
            {/* Row Number */}
            <div className="w-12 h-9 flex items-center justify-center border-r border-gray-300 bg-gray-50 text-xs text-gray-600 font-medium shrink-0">
              {rowIndex + 1}
            </div>

            {/* Data Cells */}
            {columns.map((col) => {
              const field = col.key as keyof Contact
              const value = contact[field] || ""
              const isEditing =
                editingCell?.rowIndex === rowIndex &&
                editingCell?.field === field

              return (
                <div
                  key={col.key}
                  className="h-9 border-r border-gray-300 bg-white px-1 flex items-center shrink-0 cursor-cell"
                  style={{ width: col.width }}
                  onClick={() => handleCellClick(rowIndex, field)}
                >
                  {isEditing ? (
                    <Input
                      type={field === "appointmentDate" ? "date" : "text"}
                      value={
                        field === "appointmentDate" && value
                          ? new Date(value as string)
                              .toISOString()
                              .split("T")[0]
                          : (value as string) || ""
                      }
                      onChange={(e) =>
                        handleCellChange(contact.id, field, e.target.value)
                      }
                      onBlur={handleCellBlur}
                      autoFocus
                      className="h-full w-full border border-blue-500 rounded-none px-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                    />
                  ) : field === "status" ? (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        value === "Active"
                          ? "bg-green-100 text-green-800"
                          : value === "Inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {value || "-"}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-900 px-1 w-full truncate">
                      {field === "appointmentDate" && value
                        ? new Date(value as string).toLocaleDateString()
                        : (value as string) || ""}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
