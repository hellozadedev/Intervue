import DashboardClient from '@/components/dashboard/DashboardClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

// This page is a server component. It can check cookies directly.
export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login?reason=no_token');
  }

  const userPayload = verifyToken(token);
  if (!userPayload) {
    // Invalid or expired token
    // Clear the cookie (optional, can be done on client or by setting expiry)
    // For simplicity, just redirect
    redirect('/login?reason=invalid_token');
  }

  // If token is valid, render the client component for interactivity
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-primary/10">
      <DashboardClient />
    </main>
  );
}
