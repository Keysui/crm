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
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X } from "lucide-react"

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

interface ContactDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact
  onUpdate: (contact: Contact) => void
}

export function ContactDetailsDialog({
  open,
  onOpenChange,
  contact,
  onUpdate,
}: ContactDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Contact>(contact)

  useEffect(() => {
    setFormData(contact)
    setIsEditing(false)
  }, [contact, open])

  const handleSave = () => {
    onUpdate(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(contact)
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Contact Details</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Edit the contact information below"
                  : "View contact information"}
              </DialogDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.phone || "-"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              {isEditing ? (
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.company || "-"}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobPosition">Job Position</Label>
              {isEditing ? (
                <Input
                  id="jobPosition"
                  value={formData.jobPosition}
                  onChange={(e) =>
                    setFormData({ ...formData, jobPosition: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.jobPosition || "-"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
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
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.status}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              {isEditing ? (
                <Input
                  id="plan"
                  value={formData.plan || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, plan: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.plan || "-"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment Date</Label>
              {isEditing ? (
                <Input
                  id="appointmentDate"
                  type="date"
                  value={
                    formData.appointmentDate
                      ? new Date(formData.appointmentDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentDate: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.appointmentDate
                    ? new Date(formData.appointmentDate).toLocaleDateString()
                    : "-"}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              {isEditing ? (
                <Input
                  id="businessName"
                  value={formData.businessName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.businessName || "-"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPosition">Business Position</Label>
              {isEditing ? (
                <Input
                  id="businessPosition"
                  value={formData.businessPosition || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, businessPosition: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.businessPosition || "-"}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
              />
            ) : (
              <p className="text-sm py-2 px-3 bg-muted rounded-md min-h-[80px]">
                {formData.notes || "-"}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
