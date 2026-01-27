"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Phone,
  Link2,
  Mail,
  Calendar as CalendarIcon2,
  Edit,
  Trash2,
  Plus,
  ArrowRight,
  Video
} from "lucide-react"
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
  isToday,
  startOfDay,
  addHours,
  getHours,
  getMinutes,
  setHours,
  setMinutes
} from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Appointment {
  id: string
  title: string
  contactName: string
  contactPhone: string
  start: Date
  end: Date
  type: "demo" | "call" | "meeting"
  status: "confirmed" | "pending" | "completed"
}

// Mock appointments for the current week
const generateMockAppointments = (): Appointment[] => {
  const now = new Date()
  const today = startOfDay(now)
  const monday = startOfWeek(today, { weekStartsOn: 1 })

  return [
    {
      id: "1",
      title: "Demo Call - Sarah Johnson",
      contactName: "Sarah Johnson",
      contactPhone: "+1 (555) 234-5678",
      start: addHours(monday, 14), // Monday 2:00 PM
      end: addHours(monday, 15), // Monday 3:00 PM
      type: "demo",
      status: "confirmed"
    },
    {
      id: "2",
      title: "Demo Call - Mike Davis",
      contactName: "Mike Davis",
      contactPhone: "+1 (555) 345-6789",
      start: addHours(addHours(monday, 24 * 2), 10), // Wednesday 10:00 AM
      end: addHours(addHours(monday, 24 * 2), 11), // Wednesday 11:00 AM
      type: "demo",
      status: "confirmed"
    },
    {
      id: "3",
      title: "Demo Call - John Smith",
      contactName: "John Smith",
      contactPhone: "+1 (555) 123-4567",
      start: addHours(addHours(monday, 24 * 4), 15), // Friday 3:00 PM
      end: addHours(addHours(monday, 24 * 4), 16), // Friday 4:00 PM
      type: "demo",
      status: "pending"
    }
  ]
}

// Full 24-hour view
const ALL_HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const HOUR_HEIGHT = 50 // pixels per hour for density

export default function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [syncDialogOpen, setSyncDialogOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>(generateMockAppointments())
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ day: Date; hour: number } | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const currentTimeIndicatorRef = useRef<HTMLDivElement>(null)

  // Form state for new appointment
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    contactName: "",
    contactPhone: "",
    startTime: "",
    endTime: "",
    date: ""
  })

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Calculate current time position
  const now = new Date()
  const currentHour = getHours(now)
  const currentMinute = getMinutes(now)
  const currentTimePosition = useMemo(() => {
    const hourOffset = currentHour
    const minuteOffset = currentMinute / 60
    return (hourOffset + minuteOffset) * HOUR_HEIGHT
  }, [currentHour, currentMinute])

  // Auto-scroll to current time on load
  useEffect(() => {
    if (isToday(weekStart) && currentTimeIndicatorRef.current) {
      setTimeout(() => {
        const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
        if (scrollContainer && currentTimeIndicatorRef.current) {
          currentTimeIndicatorRef.current.scrollIntoView({
            block: 'center',
            behavior: 'smooth'
          })
        }
      }, 300)
    }
  }, [weekStart])

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const goToToday = () => {
    setCurrentWeek(new Date())
  }

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => isSameDay(apt.start, day))
  }

  const getAppointmentPosition = (appointment: Appointment) => {
    const startHour = appointment.start.getHours()
    const startMinutes = appointment.start.getMinutes()
    const endHour = appointment.end.getHours()
    const endMinutes = appointment.end.getMinutes()

    const startPosition = startHour + startMinutes / 60
    const duration = (endHour + endMinutes / 60) - startPosition

    return {
      top: `${(startPosition / 24) * 100}%`,
      height: `${(duration / 24) * 100}%`,
      minHeight: `${Math.max(40, duration * HOUR_HEIGHT)}px`
    }
  }

  const handleCellClick = (day: Date, hour: number) => {
    const selectedDate = setHours(setMinutes(day, 0), hour)
    setSelectedTimeSlot({ day, hour })
    setNewAppointment({
      title: "",
      contactName: "",
      contactPhone: "",
      startTime: format(selectedDate, "HH:mm"),
      endTime: format(addHours(selectedDate, 1), "HH:mm"),
      date: format(day, "yyyy-MM-dd")
    })
    setCreateDialogOpen(true)
  }

  const handleCreateAppointment = async () => {
    if (!selectedTimeSlot || !newAppointment.title || !newAppointment.contactName) {
      toast.error("Please fill in all required fields")
      return
    }

    const [startHour, startMin] = newAppointment.startTime.split(":").map(Number)
    const [endHour, endMin] = newAppointment.endTime.split(":").map(Number)

    const start = setHours(setMinutes(selectedTimeSlot.day, startMin), startHour)
    const end = setHours(setMinutes(selectedTimeSlot.day, endMin), endHour)

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      title: newAppointment.title,
      contactName: newAppointment.contactName,
      contactPhone: newAppointment.contactPhone,
      start,
      end,
      type: "demo",
      status: "confirmed"
    }

    // Show sync toast
    toast.loading("Syncing with Google Calendar...", { id: "sync-calendar" })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setAppointments([...appointments, appointment])
    setCreateDialogOpen(false)
    setNewAppointment({ title: "", contactName: "", contactPhone: "", startTime: "", endTime: "", date: "" })
    
    toast.success("Event Created Successfully.", { id: "sync-calendar" })
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setEditDialogOpen(true)
  }

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return

    toast.loading("Removing from Google Calendar...", { id: "delete-calendar" })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setAppointments(appointments.filter(apt => apt.id !== selectedAppointment.id))
    setEditDialogOpen(false)
    setSelectedAppointment(null)
    
    toast.success("Event Cancelled.", { id: "delete-calendar" })
  }

  const isSlotOccupied = (day: Date, hour: number) => {
    return appointments.some(apt => {
      if (!isSameDay(apt.start, day)) return false
      const aptStartHour = apt.start.getHours()
      const aptEndHour = apt.end.getHours()
      return hour >= aptStartHour && hour < aptEndHour
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-display text-[#1f2937] dark:text-[#f1f5f9] leading-tight">
            Calendar
          </h1>
          <p className="text-[#6b7280] dark:text-[#94a3b8] text-base leading-relaxed mt-1">
            High-density time grid for managing appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousWeek}
            className="rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="rounded-xl"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextWeek}
            className="rounded-xl"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white hover:from-[#00E0FF] hover:to-[#00C6FF] rounded-xl gap-2"
              >
                <Link2 className="h-4 w-4" />
                Sync Calendar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect External Calendar</DialogTitle>
                <DialogDescription>
                  Connect your external calendar to sync availability and appointments.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => {
                    setSyncDialogOpen(false)
                    toast.info("Google Calendar sync will be implemented soon")
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Google Calendar</div>
                      <div className="text-xs text-muted-foreground">
                        Sync with your Google account
                      </div>
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => {
                    setSyncDialogOpen(false)
                    toast.info("Outlook sync will be implemented soon")
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Outlook</div>
                      <div className="text-xs text-muted-foreground">
                        Sync with Microsoft Outlook
                      </div>
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => {
                    setSyncDialogOpen(false)
                    toast.info("iCal sync will be implemented soon")
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <CalendarIcon2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">iCal</div>
                      <div className="text-xs text-muted-foreground">
                        Import from iCal feed URL
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Week Header */}
      <Card className="border border-gray-200/80 dark:border-gray-700 shadow-sm bg-white dark:bg-[#1e293b]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#1f2937] dark:text-[#f1f5f9]">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </CardTitle>
            <Badge variant="outline" className="bg-[#00C6FF]/10 text-[#00C6FF] border-[#00C6FF]/20">
              Week View
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="relative" ref={calendarRef}>
              {/* Day Headers - Sticky with proper z-index */}
              <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-background z-50 shadow-sm">
                <div className="p-2 border-r border-gray-200 dark:border-gray-700 bg-background">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Time
                  </div>
                </div>
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-2 border-r border-gray-200 dark:border-gray-700 text-center bg-background",
                      index === weekDays.length - 1 && "border-r-0",
                      isToday(day) && "bg-[#00C6FF]/5"
                    )}
                  >
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      {DAYS_OF_WEEK[index]}
                    </div>
                    <div
                      className={cn(
                        "text-base font-semibold",
                        isToday(day)
                          ? "text-[#00C6FF]"
                          : "text-[#1f2937] dark:text-[#f1f5f9]"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-8 relative" style={{ minHeight: `${24 * HOUR_HEIGHT}px` }}>
                {/* Time Column */}
                <div className="border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-background z-10">
                  {ALL_HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="border-b border-gray-100 dark:border-gray-800 flex items-start justify-end pr-2 pt-1"
                      style={{ height: `${HOUR_HEIGHT}px` }}
                    >
                      <span className="text-xs text-muted-foreground">
                        {hour === 0
                          ? "12 AM"
                          : hour < 12
                          ? `${hour} AM`
                          : hour === 12
                          ? "12 PM"
                          : `${hour - 12} PM`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      "relative border-r border-gray-200 dark:border-gray-700",
                      dayIndex === weekDays.length - 1 && "border-r-0",
                      isToday(day) && "bg-[#00C6FF]/5"
                    )}
                  >
                    {/* Hour Grid Lines - Clickable Cells */}
                    {ALL_HOURS.map((hour) => {
                      const isOccupied = isSlotOccupied(day, hour)
                      return (
                        <div
                          key={hour}
                          className={cn(
                            "border-b border-gray-100 dark:border-gray-800 relative group",
                            !isOccupied && "hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                          )}
                          style={{ height: `${HOUR_HEIGHT}px` }}
                          onClick={() => !isOccupied && handleCellClick(day, hour)}
                        >
                          {!isOccupied && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Current Time Indicator (Red Line) */}
                    {isToday(day) && (
                      <div
                        id="current-time-indicator"
                        ref={currentTimeIndicatorRef}
                        className="absolute left-0 right-0 z-20 pointer-events-none"
                        style={{ top: `${currentTimePosition}px` }}
                      >
                        <div className="flex items-center">
                          <div className="h-0.5 bg-red-500 flex-1 relative">
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-red-500 border-2 border-background" />
                          </div>
                          <span className="ml-2 text-xs font-semibold text-red-500 bg-background px-1.5 py-0.5 rounded">
                            NOW
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Appointments */}
                    {getAppointmentsForDay(day).map((appointment) => {
                      const position = getAppointmentPosition(appointment)

                      return (
                        <div
                          key={appointment.id}
                          onClick={() => handleAppointmentClick(appointment)}
                          className={cn(
                            "absolute left-1 right-1 rounded-lg p-2 shadow-sm border-l-4 cursor-pointer transition-all hover:shadow-md z-20",
                            appointment.status === "confirmed"
                              ? "bg-white dark:bg-[#1e293b] border-l-[#00C6FF] border border-gray-200 dark:border-gray-700"
                              : appointment.status === "pending"
                              ? "bg-yellow-50 dark:bg-yellow-950/20 border-l-yellow-500 border border-yellow-200 dark:border-yellow-800"
                              : "bg-gray-50 dark:bg-gray-800 border-l-gray-400 border border-gray-200 dark:border-gray-700"
                          )}
                          style={{
                            top: position.top,
                            height: position.height,
                            minHeight: position.minHeight
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#00C6FF]" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-xs mb-0.5 truncate text-[#1f2937] dark:text-[#f1f5f9]">
                                {appointment.title}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {format(appointment.start, "h:mm a")} - {format(appointment.end, "h:mm a")}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create Appointment Dialog - Google Style Minimalist */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">New Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Row 1: Title Input (Large, no label) */}
            <Input
              placeholder="Add title"
              value={newAppointment.title}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, title: e.target.value })
              }
              className="text-lg font-medium border-0 border-b-2 border-gray-200 dark:border-gray-700 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#00C6FF]"
            />

            {/* Row 2: Time + Date */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="time"
                  value={newAppointment.startTime}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, startTime: e.target.value })
                  }
                  className="flex-1"
                />
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={newAppointment.endTime}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, endTime: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
              <Input
                type="date"
                value={newAppointment.date || format(selectedTimeSlot?.day || new Date(), "yyyy-MM-dd")}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, date: e.target.value })
                }
                className="flex-1"
              />
            </div>

            {/* Row 3: Guest (Client Name / Phone) */}
            <div className="space-y-2">
              <Input
                placeholder="Client name"
                value={newAppointment.contactName}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, contactName: e.target.value })
                }
              />
              <Input
                placeholder="Phone number"
                value={newAppointment.contactPhone}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, contactPhone: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateAppointment}
              className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white hover:from-[#00E0FF] hover:to-[#00C6FF]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog - Centered Google Style */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <DialogTitle className="text-2xl font-semibold pr-8">
                {selectedAppointment?.title}
              </DialogTitle>
              <div className="flex items-center gap-2 -mt-2 -mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    toast.info("Edit functionality will be implemented soon")
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={handleDeleteAppointment}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Time
                </div>
                <div className="text-sm font-medium">
                  {format(selectedAppointment.start, "EEEE, MMM d, h:mm a")} - {format(selectedAppointment.end, "h:mm a")}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Guest
                </div>
                <div className="text-sm font-medium">{selectedAppointment.contactName}</div>
                <div className="text-sm text-muted-foreground">{selectedAppointment.contactPhone}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    selectedAppointment.status === "confirmed"
                      ? "bg-[#00C6FF]/10 text-[#00C6FF] border-[#00C6FF]/20"
                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  )}
                >
                  {selectedAppointment.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white hover:from-[#00E0FF] hover:to-[#00C6FF] gap-2"
            >
              <Video className="h-4 w-4" />
              Join Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
