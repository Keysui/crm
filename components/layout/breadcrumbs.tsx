"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

export function Breadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  const getBreadcrumbName = (path: string) => {
    const names: Record<string, string> = {
      dashboard: "Dashboard",
      leads: "Leads",
      automations: "Automations",
      "ai-settings": "AI Settings",
      account: "Account",
    }
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="items-center">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1
          const href = `/${paths.slice(0, index + 1).join("/")}`
          const name = getBreadcrumbName(path)

          return (
            <div key={path} className="flex items-center">
              <BreadcrumbSeparator className="text-muted-foreground/40" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
