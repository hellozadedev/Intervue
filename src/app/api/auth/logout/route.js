import { getAppSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getAppSession();
    await session.destroy();
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Server error during logout.' }, { status: 500 });
  }
}
