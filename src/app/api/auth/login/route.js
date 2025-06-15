import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getAppSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const session = await getAppSession();
    session.user = { 
      userId: user._id.toString(), 
      email: user.email 
    };
    await session.save();

    return NextResponse.json({ success: true, message: 'Logged in successfully.' });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error during login.' }, { status: 500 });
  }
}
