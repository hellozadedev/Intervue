import dbConnect from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import { getAppSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const session = await getAppSession();
  if (!session.user || !session.user.userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();
  
  const { id } = params;
  const { type, note } = await request.json(); // type can be 'preInterview' or 'postInterview'

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
