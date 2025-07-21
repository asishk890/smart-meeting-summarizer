import { cva, type VariantProps } from 'class-variance-authority'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

// This defines the possible styles (just size) for the spinner.
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

// ========= THIS IS THE CRITICAL PART FOR THE FIX =========
// This interface gets the variants from `spinnerVariants`. This is what
// makes `size` a valid prop on the Spinner component.
type SpinnerProps = VariantProps<typeof spinnerVariants>
// ========================================================

export const Spinner = ({ size }: SpinnerProps) => {
  return <Loader className={cn(spinnerVariants({ size }))} />
}