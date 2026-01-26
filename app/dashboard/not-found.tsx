import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#111827]">404</h1>
        <h2 className="text-xl font-semibold text-[#374151]">Page Not Found</h2>
        <p className="text-[#6b7280] max-w-md">
          This dashboard page doesn't exist or has been removed.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
