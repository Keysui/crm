import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[#1f2937] placeholder:text-[#9ca3af] selection:bg-[#00C6FF] selection:text-white bg-[#f9fafb] h-11 w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-base shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-[#1f2937]",
        "focus-visible:border-[#00C6FF] focus-visible:ring-[#00C6FF]/20 focus-visible:ring-[3px] focus-visible:bg-white focus-visible:shadow-md",
        "hover:border-[#00C6FF]/50 hover:bg-white",
        "aria-invalid:ring-[#ef4444]/20 aria-invalid:border-[#ef4444]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
