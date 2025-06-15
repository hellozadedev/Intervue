
import { redirect } from 'next/navigation';
import { getAppSession } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default async function HomePage() {
  const session = await getAppSession();

  if (session && session.user && session.user.userId) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }

  // This part will ideally not be reached due to redirects.
  // Kept for fallback or if redirect logic changes.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg text-foreground">Loading Intervue...</p>
    </div>
  );
}
