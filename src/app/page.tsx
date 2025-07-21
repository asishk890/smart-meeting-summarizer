// FILE: /app/page.tsx (New Workaround Version)

import Link from 'next/link';
// We import BOTH the Button component AND its styling function
import { Button, buttonVariants } from '@/components/ui/button'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-light sm:text-6xl md:text-7xl">
          Never Take Meeting Notes Again
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-highlight">
          Upload your meeting audio, and let our AI provide you with a perfect summary, key points, and actionable items. Focus on the conversation, not the note-taking.
        </p>
        <div className="mt-8 flex justify-center gap-4">

          {/* === THIS IS THE FIX === */}
          {/* We apply the button's styles directly to the Link component */}
          <Link 
            href="/dashboard"
            className={buttonVariants({ size: 'lg' })}
          >
            Get Started for Free
          </Link>
          {/* ======================= */}

        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Fast Transcription</CardTitle></CardHeader>
          <CardContent>
            {/* Corrected a typo here */}
            <p>Our AI, powered by OpenAI s Whisper, provides highly accurate transcriptions in minutes.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Intelligent Summaries</CardTitle></CardHeader>
          <CardContent>
            <p>Go beyond transcripts. Get concise summaries that highlight what truly matters.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Action Items</CardTitle></CardHeader>
          <CardContent>
            <p>Automatically extract tasks and decisions so your team knows the next steps.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}