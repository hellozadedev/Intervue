'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check for auth token (e.g., from localStorage or a cookie check function)
    // For this example, we'll directly redirect to login.
    // A more robust solution would check a token and redirect to /dashboard if authenticated.
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg text-foreground">Loading Intervue...</p>
    </div>
  );
}
