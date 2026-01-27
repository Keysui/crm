"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  openItems: Set<string>
  toggleItem: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

interface AccordionProps {
  children: React.ReactNode
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  className?: string
}

export function Accordion({ 
  children, 
  type = "single",
  defaultValue,
  className 
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (defaultValue) {
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue])
    }
    return new Set()
  })

  const toggleItem = React.useCallback((value: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        if (type === "single") {
          next.clear()
        }
        next.add(value)
      }
      return next
    })
  }, [type])

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("space-y-2", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <div className={cn("border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden", className)}>
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({ value, children, className }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("AccordionTrigger must be used within Accordion")
  }

  const { openItems, toggleItem } = context
  const isOpen = openItems.has(value)

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={cn(
        "w-full flex items-center justify-between p-4 text-left font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
        isOpen && "bg-gray-50 dark:bg-gray-800/50",
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )}
      />
    </button>
  )
}

interface AccordionContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ value, children, className }: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("AccordionContent must be used within Accordion")
  }

  const { openItems } = context
  const isOpen = openItems.has(value)

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className={cn("p-4 pt-0", className)}>
        {children}
      </div>
    </div>
  )
}
