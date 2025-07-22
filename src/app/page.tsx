'use client'

import Link from 'next/link'
// --- FIX STEP 1: Import the correct, specialized hook ---
import { useRedirectIfAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Brain, FileText, Users, Shield, Zap } from 'lucide-react'
// The router is handled automatically by the hook, but we keep the import in case you need it for other links.
import { useRouter } from 'next/navigation' 
import { useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'

// Note: To make the text gradient work, you'll need to add a utility class.
// In globals.css, add:
// .text-gradient {
//   background-image: linear-gradient(to right, #3b82f6, #8b5cf6);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// }
// For the glow effect:
// .shadow-glow {
//  box-shadow: 0 0 20px 0px rgba(99, 102, 241, 0.5);
// }

export default function HomePage() {
  // --- FIX STEP 2: Call the correct hook. It requires no arguments. ---
  // It will handle redirecting the user if they are already authenticated.
  const { isLoading, isAuthenticated } = useRedirectIfAuth();
  
  // No router logic is needed here anymore, as the hook handles it internally!
  // The useRedirectIfAuth hook will automatically push to '/dashboard' if isAuthenticated becomes true.
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  // If the user is authenticated, the hook will have already initiated a redirect,
  // and this component will unmount shortly. You can optionally render null.
  if (isAuthenticated) {
      return null; 
  }
  
  // Only non-authenticated users will see the main page content.
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-gradient">SmartSummarizer</h1>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
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
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Brain className="w-12 h-12 text-white" />
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
        <section className="py-24 bg-card/50">
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
                <Card key={feature.title} className="p-6 text-center transform hover:-translate-y-2 transition-transform duration-300 bg-card">
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
          <Card className="p-12 text-center bg-gradient-to-br from-card to-card/50 border border-primary/20 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make Your Meetings Smarter?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of productive teams who are saving time and effort with AI.
            </p>
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-200 text-lg px-12 py-6">
              <Link href="/register">Sign Up Now</Link>
            </Button>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartSummarizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}