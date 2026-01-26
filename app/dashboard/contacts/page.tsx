"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Eye, Table2 } from "lucide-react"
import { CreateContactDialog } from "@/components/contacts/create-contact-dialog"
import { ContactDetailsDialog } from "@/components/contacts/contact-details-dialog"
import { ContactSpreadsheetDialog } from "@/components/contacts/contact-spreadsheet-dialog"
import { ContactsSpreadsheet } from "@/components/contacts/contacts-spreadsheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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

const STORAGE_KEY = "crm_contacts"

// Test contacts for demonstration
const getTestContacts = (): Contact[] => [
  {
    id: "test_1",
    name: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    jobPosition: "CEO",
    status: "Active",
    notes: "Interested in enterprise plan. Follow up next week.",
    plan: "Enterprise",
    appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    businessName: "TechCorp Solutions",
    businessPosition: "Founder & CEO",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test_2",
    name: "Sarah Johnson",
    email: "sarah.j@designstudio.com",
    phone: "+1 (555) 234-5678",
    company: "Design Studio",
    jobPosition: "Creative Director",
    status: "Active",
    notes: "Looking for basic plan. Very responsive.",
    plan: "Basic",
    appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    businessName: "Design Studio LLC",
    businessPosition: "Creative Director",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test_3",
    name: "Michael Chen",
    email: "mchen@startup.io",
    phone: "+1 (555) 345-6789",
    company: "Startup.io",
    jobPosition: "CTO",
    status: "Pending",
    notes: "Evaluating options. Needs custom solution.",
    plan: "Pro",
    appointmentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    businessName: "Startup.io Technologies",
    businessPosition: "Chief Technology Officer",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test_4",
    name: "Emily Rodriguez",
    email: "emily.r@marketingpro.com",
    phone: "+1 (555) 456-7890",
    company: "Marketing Pro",
    jobPosition: "Marketing Manager",
    status: "Active",
    notes: "Signed up for Pro plan. Very satisfied customer.",
    plan: "Pro",
    appointmentDate: "",
    businessName: "Marketing Pro Agency",
    businessPosition: "Senior Marketing Manager",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test_5",
    name: "David Williams",
    email: "david.w@consulting.com",
    phone: "+1 (555) 567-8901",
    company: "Williams Consulting",
    jobPosition: "Principal Consultant",
    status: "Inactive",
    notes: "Previous customer. May return in Q2.",
    plan: "Enterprise",
    appointmentDate: "",
    businessName: "Williams Consulting Group",
    businessPosition: "Principal & Founder",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test_6",
    name: "Lisa Anderson",
    email: "lisa.a@retailstore.com",
    phone: "+1 (555) 678-9012",
    company: "Retail Store Chain",
    jobPosition: "Operations Manager",
    status: "Active",
    notes: "Interested in bulk pricing for multiple locations.",
    plan: "Enterprise",
    appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    businessName: "Retail Store Chain Inc.",
    businessPosition: "Operations Manager",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test_7",
    name: "Robert Taylor",
    email: "robert.t@finance.com",
    phone: "+1 (555) 789-0123",
    company: "Finance Solutions",
    jobPosition: "CFO",
    status: "Pending",
    notes: "Budget approval pending. Follow up in 2 weeks.",
    plan: "Pro",
    appointmentDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    businessName: "Finance Solutions Ltd.",
    businessPosition: "Chief Financial Officer",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test_8",
    name: "Jennifer Martinez",
    email: "jennifer.m@healthcare.com",
    phone: "+1 (555) 890-1234",
    company: "Healthcare Systems",
    jobPosition: "IT Director",
    status: "Active",
    notes: "HIPAA compliance requirements discussed.",
    plan: "Enterprise",
    appointmentDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    businessName: "Healthcare Systems Corp",
    businessPosition: "IT Director",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isSpreadsheetDialogOpen, setIsSpreadsheetDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("contacts")
  const pathname = usePathname()
  const contactsRef = useRef<Contact[]>([])

  // Keep ref in sync with state
  useEffect(() => {
    contactsRef.current = contacts
  }, [contacts])

  // Function to save contacts to localStorage
  const saveContacts = (contactsToSave: Contact[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contactsToSave))
    } catch (error) {
      console.error("Failed to save contacts:", error)
    }
  }

  // Load contacts from localStorage on mount, or use test data if empty
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsedContacts = JSON.parse(stored)
        if (parsedContacts.length > 0) {
          setContacts(parsedContacts)
          contactsRef.current = parsedContacts
          return
        }
      } catch (error) {
        console.error("Failed to load contacts:", error)
      }
    }
    // If no contacts exist, load test data
    const testContacts = getTestContacts()
    setContacts(testContacts)
    contactsRef.current = testContacts
    saveContacts(testContacts)
  }, [])

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (contacts.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      saveContacts(contacts)
    }
  }, [contacts])

  // Save when navigating away (component unmounts or pathname changes)
  useEffect(() => {
    return () => {
      // Cleanup: save contacts when component unmounts
      if (contactsRef.current.length > 0 || localStorage.getItem(STORAGE_KEY)) {
        saveContacts(contactsRef.current)
      }
    }
  }, [])

  // Save when pathname changes (navigating to different route)
  useEffect(() => {
    // Save before navigation
    if (contactsRef.current.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      saveContacts(contactsRef.current)
    }
  }, [pathname])

  // Save when tab becomes hidden (user switches tabs or navigates away)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && (contactsRef.current.length > 0 || localStorage.getItem(STORAGE_KEY))) {
        saveContacts(contactsRef.current)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (contactsRef.current.length > 0 || localStorage.getItem(STORAGE_KEY)) {
        saveContacts(contactsRef.current)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  const handleCreateContact = (contact: Omit<Contact, "id" | "createdAt">) => {
    const newContact: Contact = {
      ...contact,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    setContacts((prev) => [...prev, newContact])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    )
    setIsDetailsDialogOpen(false)
    setSelectedContact(null)
  }

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDetailsDialogOpen(true)
  }

  const handleOpenSpreadsheet = (contact: Contact) => {
    setSelectedContact(contact)
    setIsSpreadsheetDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your contacts and track interactions
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="spreadsheet">Contacts Spreadsheet</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="mt-6">
          {contacts.length === 0 ? (
            <div className="border rounded-lg p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No contacts yet. Create your first contact to get started.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Job Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>{contact.jobPosition}</TableCell>
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
                      <TableCell className="max-w-xs truncate">
                        {contact.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewContact(contact)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenSpreadsheet(contact)}
                          >
                            <Table2 className="h-4 w-4 mr-1" />
                            Spreadsheet
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="spreadsheet" className="mt-6">
          <ContactsSpreadsheet
            contacts={contacts}
            onUpdateContact={handleUpdateContact}
          />
        </TabsContent>
      </Tabs>

      <CreateContactDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateContact}
      />

      {selectedContact && (
        <>
          <ContactDetailsDialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
            contact={selectedContact}
            onUpdate={handleUpdateContact}
          />
          <ContactSpreadsheetDialog
            open={isSpreadsheetDialogOpen}
            onOpenChange={setIsSpreadsheetDialogOpen}
            contact={selectedContact}
          />
        </>
      )}
    </div>
  )
}
