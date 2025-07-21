import Link from 'next/link'
import { Mic } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
                <Mic className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">SmartSummarizer</span>
            </Link>
        </div>
        {children}
      </div>
    </div>
  )
}