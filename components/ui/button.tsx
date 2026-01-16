import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#00C6FF] focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "btn-gradient text-white hover:shadow-lg",
        destructive:
          "bg-[#ef4444] text-white hover:bg-[#dc2626] focus-visible:ring-[#ef4444]/20 shadow-sm",
        outline:
          "border-2 border-[#00C6FF] bg-white text-[#0072FF] hover:bg-[#00C6FF]/10 shadow-sm hover:shadow-md",
        secondary:
          "bg-[#f9fafb] text-[#1f2937] border border-gray-200 hover:bg-[#f3f4f6] hover:border-[#00C6FF]",
        ghost:
          "hover:bg-[#f9fafb] hover:text-[#1f2937] text-[#4b5563]",
        link: "text-[#0072FF] underline-offset-4 hover:underline hover:text-[#00C6FF]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
