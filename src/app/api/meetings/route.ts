import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { db } from '@/lib/mock-db';
import { transcribeAudio, summarizeTranscription } from '@/lib/ai';

// GET all meetings for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const meetings = await db.meeting.findByUserId(userId);
    return NextResponse.json(meetings);
  } catch (error) {
    console.error('GET /api/meetings Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new meeting (Upload, Transcribe, Summarize)
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file || !title) {
      return NextResponse.json({ message: 'Missing file or title' }, { status: 400 });
    }
    
    // Step 1: Transcribe Audio
    const transcription = await transcribeAudio(file);
    
    // Step 2: Summarize Transcription
    const { summary, actionItems } = await summarizeTranscription(transcription);

    // Step 3: Save to Database
    const newMeeting = await db.meeting.create({
      userId,
      title,
      transcription,
      summary,
      actionItems,
      fileName: file.name
    });

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/meetings Error:', error);
    // Provide more specific error messages if possible
    const errorMessage = error.message || 'An unexpected error occurred during processing.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}