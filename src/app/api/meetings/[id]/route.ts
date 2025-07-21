import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { db } from '@/lib/mock-db';

interface RouteParams {
  params: { id: string };
}

// GET a single meeting by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
   try {
    const userId = await getUserIdFromRequest(request);
    const meetingId = params.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

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
    const userId = await getUserIdFromRequest(request);
    const meetingId = params.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
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