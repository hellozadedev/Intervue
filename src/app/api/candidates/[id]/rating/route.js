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
  const { rating } = await request.json();

  if (typeof rating !== 'number' || rating < 0 || rating > 5) {
    return NextResponse.json({ message: 'Invalid rating. Must be a number between 0 and 5.' }, { status: 400 });
  }

  try {
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { rating, lastUpdatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return NextResponse.json({ message: 'Candidate not found.' }, { status: 404 });
    }
    
    return NextResponse.json(candidate, { status: 200 });
  } catch (error) {
    console.error('Update rating error:', error);
    return NextResponse.json({ message: 'Server error while updating rating.' }, { status: 500 });
  }
}
