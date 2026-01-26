"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Maximize2, Minimize2, Plus, Trash2 } from "lucide-react"

interface Contact {
  id: string
  name: string
}

interface SpreadsheetRow {
  id: string
  date: string
  activity: string
  notes: string
  status: string
  outcome: string
}

interface ContactSpreadsheetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact
}

export function ContactSpreadsheetDialog({
  open,
  onOpenChange,
  contact,
}: ContactSpreadsheetDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rows, setRows] = useState<SpreadsheetRow[]>([])
  const [editingCell, setEditingCell] = useState<{
    rowId: string
    field: keyof SpreadsheetRow
  } | null>(null)
  const [newRow, setNewRow] = useState<Omit<SpreadsheetRow, "id">>({
    date: new Date().toISOString().split("T")[0],
    activity: "",
    notes: "",
    status: "In Progress",
    outcome: "",
  })

  const STORAGE_KEY = `crm_contact_spreadsheet_${contact.id}`

  // Load spreadsheet data from localStorage
  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setRows(JSON.parse(stored))
        } catch (error) {
          console.error("Failed to load spreadsheet data:", error)
        }
      }
    }
  }, [open, STORAGE_KEY])

  // Save spreadsheet data to localStorage
  useEffect(() => {
    if (rows.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
    }
  }, [rows, STORAGE_KEY])

  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault()
    const row: SpreadsheetRow = {
      id: `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...newRow,
    }
    setRows([...rows, row])
    setNewRow({
      date: new Date().toISOString().split("T")[0],
      activity: "",
      notes: "",
      status: "In Progress",
      outcome: "",
    })
  }

  const handleDeleteRow = (rowId: string) => {
    setRows(rows.filter((row) => row.id !== rowId))
  }

  const handleCellClick = (rowId: string, field: keyof SpreadsheetRow) => {
    setEditingCell({ rowId, field })
  }

  const handleCellChange = (rowId: string, field: keyof SpreadsheetRow, value: string) => {
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    )
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          isFullscreen
            ? "!max-w-[100vw] !max-h-[100vh] !w-screen !h-screen !m-0 !p-6 !rounded-none !top-0 !left-0 !translate-x-0 !translate-y-0 overflow-y-auto"
            : "max-w-[98vw] w-[98vw] max-h-[90vh] overflow-y-auto"
        }
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>
                Progress Tracker - {contact.name}
              </DialogTitle>
              <DialogDescription>
                Track activities and progress for this contact
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Entry Form */}
          <form onSubmit={handleAddRow} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Add New Entry</h3>
            <div className={`grid gap-4 ${isFullscreen ? "grid-cols-6" : "grid-cols-5"}`}>
              <div className="space-y-2">
                <Label htmlFor="new-date">Date</Label>
                <Input
                  id="new-date"
                  type="date"
                  value={newRow.date}
                  onChange={(e) =>
                    setNewRow({ ...newRow, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-activity">Activity</Label>
                <Input
                  id="new-activity"
                  value={newRow.activity}
                  onChange={(e) =>
                    setNewRow({ ...newRow, activity: e.target.value })
                  }
                  required
                />
              </div>
              {isFullscreen && (
                <div className="space-y-2">
                  <Label htmlFor="new-notes">Notes</Label>
                  <Input
                    id="new-notes"
                    value={newRow.notes}
                    onChange={(e) =>
                      setNewRow({ ...newRow, notes: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <Select
                  value={newRow.status}
                  onValueChange={(value) =>
                    setNewRow({ ...newRow, status: value })
                  }
                >
                  <SelectTrigger id="new-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-outcome">Outcome</Label>
                <Input
                  id="new-outcome"
                  value={newRow.outcome}
                  onChange={(e) =>
                    setNewRow({ ...newRow, outcome: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 flex items-end">
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            {!isFullscreen && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="new-notes-inline">Notes</Label>
                <Textarea
                  id="new-notes-inline"
                  value={newRow.notes}
                  onChange={(e) =>
                    setNewRow({ ...newRow, notes: e.target.value })
                  }
                  rows={2}
                />
              </div>
            )}
          </form>

          {/* Spreadsheet Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isFullscreen ? "w-[120px] min-w-[120px]" : ""}>
                    Date
                  </TableHead>
                  <TableHead className={isFullscreen ? "w-[200px] min-w-[200px]" : ""}>
                    Activity
                  </TableHead>
                  <TableHead className={isFullscreen ? "w-[300px] min-w-[300px]" : ""}>
                    Notes
                  </TableHead>
                  <TableHead className={isFullscreen ? "w-[150px] min-w-[150px]" : ""}>
                    Status
                  </TableHead>
                  <TableHead className={isFullscreen ? "w-[200px] min-w-[200px]" : ""}>
                    Outcome
                  </TableHead>
                  <TableHead className={isFullscreen ? "w-[100px] min-w-[100px]" : "text-right"}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No entries yet. Add your first entry above.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        onClick={() => handleCellClick(row.id, "date")}
                        className="cursor-pointer hover:bg-muted"
                      >
                        {editingCell?.rowId === row.id &&
                        editingCell?.field === "date" ? (
                          <Input
                            type="date"
                            value={row.date}
                            onChange={(e) =>
                              handleCellChange(row.id, "date", e.target.value)
                            }
                            onBlur={handleCellBlur}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          row.date
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => handleCellClick(row.id, "activity")}
                        className="cursor-pointer hover:bg-muted"
                      >
                        {editingCell?.rowId === row.id &&
                        editingCell?.field === "activity" ? (
                          <Input
                            value={row.activity}
                            onChange={(e) =>
                              handleCellChange(
                                row.id,
                                "activity",
                                e.target.value
                              )
                            }
                            onBlur={handleCellBlur}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          row.activity
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => handleCellClick(row.id, "notes")}
                        className="cursor-pointer hover:bg-muted max-w-xs"
                      >
                        {editingCell?.rowId === row.id &&
                        editingCell?.field === "notes" ? (
                          <Input
                            value={row.notes}
                            onChange={(e) =>
                              handleCellChange(row.id, "notes", e.target.value)
                            }
                            onBlur={handleCellBlur}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          <span className="truncate block">
                            {row.notes || "-"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => handleCellClick(row.id, "status")}
                        className="cursor-pointer hover:bg-muted"
                      >
                        {editingCell?.rowId === row.id &&
                        editingCell?.field === "status" ? (
                          <Select
                            value={row.status}
                            onValueChange={(value) => {
                              handleCellChange(row.id, "status", value)
                              handleCellBlur()
                            }}
                            open
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              row.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : row.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : row.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {row.status}
                          </span>
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => handleCellClick(row.id, "outcome")}
                        className="cursor-pointer hover:bg-muted"
                      >
                        {editingCell?.rowId === row.id &&
                        editingCell?.field === "outcome" ? (
                          <Input
                            value={row.outcome}
                            onChange={(e) =>
                              handleCellChange(row.id, "outcome", e.target.value)
                            }
                            onBlur={handleCellBlur}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          row.outcome || "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRow(row.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
