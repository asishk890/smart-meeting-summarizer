// src/app/api/meetings/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth"; // The modern way to verify the user's session
import { AIService } from "@/lib/ai";   // The class-based service for AI operations
import { db } from "@/lib/mock-db";      // Your mock database utility

/**
 * Handles GET requests to fetch all meetings for the logged-in user.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Get the session token from the secure HttpOnly cookie
    const token = (await cookies()).get('session_token')?.value;

    if (!token) {
      // If no token exists, the user is not logged in.
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Verify that the token is valid and not expired
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // 3. Use the trusted userId from the token to fetch data
    const userId = decodedToken.userId;
    const meetings = await db.meeting.findByUserId(userId);
    
    return NextResponse.json(meetings);

  } catch (error) {
    console.error('GET /api/meetings Error:', error);
    // Use a type-safe way to get the error message
    let errorMessage = "An internal server error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

/**
 * Handles POST requests to upload, process, and create a new meeting.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Perform the same robust authentication check as in GET
    const token = (await cookies()).get('session_token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = decodedToken.userId;

    // 2. Parse the incoming form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file || !title) {
      return NextResponse.json({ message: 'Missing file or title' }, { status: 400 });
    }

    // 3. Use the centralized AIService for AI processing
    const transcription = await AIService.transcribeAudio(file, 'en');
    if (!transcription || transcription.trim().length === 0) {
        throw new Error('Transcription failed or resulted in empty text.');
    }
    
    const summaryData = await AIService.summarizeMeeting(transcription, title);
    
    // 4. Save the new meeting to the database
    // This now saves the rich ActionItem[] objects from the AI service,
    // assuming your database type definitions have been updated accordingly.
    const newMeeting = await db.meeting.create({
      userId,
      title,
      transcription,
      summary: summaryData.fullSummary,
      actionItems: summaryData.actionItems, // Saving the array of objects
      fileName: file.name
    });

    // 5. Return the newly created meeting with a 201 status
    return NextResponse.json(newMeeting, { status: 201 });

  } catch (error) {
    console.error('POST /api/meetings Error:', error);
    let errorMessage = 'An unexpected error occurred during processing.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}