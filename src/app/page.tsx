'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Brain, FileText, Users, Shield, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'

export default function HomePage() {
  // =================================================================
  // =====> THE ROOT CAUSE AND FIX IS HERE <=====
  //
  // WRONG: const { authState } = useAuth()
  // This is wrong because the `useAuth` hook returns a flat object.
  // It does NOT return an object nested under `authState`.
  //
  // CORRECT: Destructure the properties you need directly.
  const { isAuthenticated, isLoading } = useAuth()
  // =================================================================

  const router = useRouter()

  useEffect(() => {
    // Now we use the `isAuthenticated` variable directly.
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Now we use the `isLoading` variable directly.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {/*
          This line will no longer show an error once the `useAuth`
          hook usage is corrected above. TypeScript will now
          correctly recognize the props for the Spinner component.
        */}
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-gradient">SmartSummarizer</h1>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/*
              This line will also be fixed. When the component's main type
              inference is correct, TypeScript will recognize the `variant` prop.
            */}
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="animate-float mx-auto mb-8 w-fit">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tighter">
            Transform Meetings with <span className="text-gradient">AI Summaries</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Upload recordings and get instant transcriptions, summaries, action items, and key insights powered by OpenAI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-8 py-6">
              <Link href="/register">Start for Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link href="/login">Login to Dashboard</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features, Simple Workflow</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From audio upload to actionable insights, our platform streamlines your post-meeting process.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Mic, title: 'Audio Transcription', text: 'Accurate transcriptions using OpenAI Whisper.', color: 'from-blue-500 to-blue-600' },
                { icon: Brain, title: 'AI Summarization', text: 'Intelligent summaries with key points using GPT-4.', color: 'from-purple-500 to-purple-600' },
                { icon: FileText, title: 'Action Items', text: 'Automatically extract action items and deadlines.', color: 'from-green-500 to-green-600' },
                { icon: Users, title: 'Participant Tracking', text: 'Identify speakers and track their contributions.', color: 'from-yellow-500 to-yellow-600' },
                { icon: Shield, title: 'Secure & Private', text: 'Your data is encrypted and securely stored.', color: 'from-red-500 to-red-600' },
                { icon: Zap, title: 'Lightning Fast', text: 'Process meetings in minutes, not hours.', color: 'from-indigo-500 to-indigo-600' },
              ].map(feature => (
                <Card key={feature.title} className="p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24">
          <Card className="p-12 text-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make Your Meetings Smarter?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of productive teams who are saving time and effort with AI.
            </p>
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-200 text-lg px-12 py-6">
              <Link href="/register">Sign Up Now</Link>
            </Button>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartSummarizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}