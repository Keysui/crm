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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Contact {
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
}

interface CreateContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (contact: Contact) => void
}

export function CreateContactDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateContactDialogProps) {
  const [formData, setFormData] = useState<Contact>({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobPosition: "",
    status: "Active",
    notes: "",
    plan: "",
    appointmentDate: "",
    businessName: "",
    businessPosition: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      return
    }
    onSuccess(formData)
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      jobPosition: "",
      status: "Active",
      notes: "",
      plan: "",
      appointmentDate: "",
      businessName: "",
      businessPosition: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Enter the contact information below. Name and email are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobPosition">Job Position</Label>
              <Input
                id="jobPosition"
                value={formData.jobPosition}
                onChange={(e) =>
                  setFormData({ ...formData, jobPosition: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Input
                id="plan"
                value={formData.plan || ""}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
                placeholder="e.g., Basic, Pro, Enterprise"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment Date</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={formData.appointmentDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPosition">Business Position</Label>
              <Input
                id="businessPosition"
                value={formData.businessPosition || ""}
                onChange={(e) =>
                  setFormData({ ...formData, businessPosition: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Contact</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
