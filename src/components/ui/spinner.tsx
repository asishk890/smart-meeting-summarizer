import { cva, type VariantProps } from 'class-variance-authority'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-10 w-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// ========= FIX #1: Add `className` to the props interface =============
interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}
// ===================================================================

export const Spinner = ({ size, className }: SpinnerProps) => {
  return (
    // ===== FIX #2: Pass the className into the `cn` function =====
    // This will merge the base spinner styles with any custom classes
    // you provide, like "mr-2".
    <Loader className={cn(spinnerVariants({ size, className }))} />
    // ===========================================================
  )
}