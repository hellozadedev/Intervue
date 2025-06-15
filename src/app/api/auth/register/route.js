
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
    }

    const newUser = new User({ email, password });
    await newUser.save(); // Password will be hashed by pre-save hook in User model

    return NextResponse.json({ success: true, message: 'User created successfully. Please login.' }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
        // Extract validation messages
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ message: messages.join(', ') }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error during registration.' }, { status: 500 });
  }
}
