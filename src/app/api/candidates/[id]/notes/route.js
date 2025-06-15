import dbConnect from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
  const token = cookies().get('token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();
  
  const { id } = params;
  const { type, note } // type can be 'preInterview' or 'postInterview'
 = await request.json();

  if (!type || !note || (type !== 'preInterview' && type !== 'postInterview')) {
    return NextResponse.json({ message: 'Invalid note type or missing note content.' }, { status: 400 });
  }

  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return NextResponse.json({ message: 'Candidate not found.' }, { status: 404 });
    }

    const newNote = { note, timestamp: new Date() };

    if (type === 'preInterview') {
      candidate.preInterviewNotes.push(newNote);
    } else { // postInterview
      candidate.postInterviewNotes.push(newNote);
    }
    
    candidate.lastUpdatedAt = new Date();
    await candidate.save();
    
    return NextResponse.json(candidate, { status: 200 });
  } catch (error) {
    console.error('Update notes error:', error);
    return NextResponse.json({ message: 'Server error while updating notes.' }, { status: 500 });
  }
}
