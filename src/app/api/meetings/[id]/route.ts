import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // --- FIX 1: IMPORT cookies

// --- FIX 2: IMPORT THE CORRECT FUNCTION ---
// We no longer use getUserIdFromRequest. We use verifyToken.
import { verifyToken } from '@/lib/auth';

import { db } from '@/lib/mock-db';

interface RouteParams {
  params: { id: string };
}

// GET a single meeting by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
   try {
    // --- FIX 3: IMPLEMENT THE NEW AUTHENTICATION FLOW ---
    const token = (await cookies()).get('session_token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = decodedToken.userId;
    // --- END OF AUTH FIX ---

    const meetingId = params.id;
    const meeting = await db.meeting.findById(meetingId);

    // Security check: ensure the meeting belongs to the user
    if (!meeting || meeting.userId !== userId) {
      return NextResponse.json({ message: 'Meeting not found' }, { status: 404 });
    }
    
    return NextResponse.json(meeting);
  } catch (error) {
    console.error(`GET /api/meetings/${params.id} Error:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a meeting
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // --- FIX 4: IMPLEMENT THE NEW AUTHENTICATION FLOW HERE AS WELL ---
    const token = (await cookies()).get('session_token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = decodedToken.userId;
    // --- END OF AUTH FIX ---

    const meetingId = params.id;
    const meeting = await db.meeting.findById(meetingId);
    
    if (!meeting || meeting.userId !== userId) {
      return NextResponse.json({ message: 'Meeting not found or you do not have permission' }, { status: 404 });
    }
    
    await db.meeting.delete(meetingId);

    return NextResponse.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/meetings/${params.id} Error:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}