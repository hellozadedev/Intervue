
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CandidateDisplay from './CandidateDisplay';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';


export default function DashboardClient({ user }) {
  const [searchEmail, setSearchEmail] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    setIsLoading(true);
    setCandidate(null);
    setNotFound(false);

    try {
      const res = await fetch(`/api/candidates/search?email=${encodeURIComponent(searchEmail)}`);
      const data = await res.json();

      if (res.ok) {
        setCandidate(data);
      } else if (res.status === 404) {
        setNotFound(true);
        toast({
          variant: "default",
          title: "Candidate Not Found",
          description: `No candidate found with email: ${searchEmail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Search Failed",
          description: data.message || "An error occurred during search.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to the server for search.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCandidate = (updatedCandidate) => {
    setCandidate(updatedCandidate);
  };
  
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
        router.push('/login');
        router.refresh(); // To ensure server-side state is updated
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: "Logout Failed", description: data.message || "Could not log out." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Logout Failed", description: "Could not log out." });
    }
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline text-primary">Intervue Dashboard</h1>
          {user && <p className="text-sm text-muted-foreground">Welcome, {user.email}</p>}
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-accent-foreground border-accent hover:bg-accent/10">
            <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Search Candidate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <Label htmlFor="search-email" className="sr-only">Search by Email</Label>
            <Input
              id="search-email"
              type="email"
              placeholder="Candidate's email address"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              required
              className="flex-grow bg-white"
            />
            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {notFound && !candidate && (
         <Card className="mt-6 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center font-headline text-destructive">Candidate Not Found</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-muted-foreground">No candidate found with the email: {searchEmail}. Please check the email and try again.</p>
           </CardContent>
         </Card>
      )}
      
      <CandidateDisplay candidate={candidate} onUpdateCandidate={handleUpdateCandidate} />
    </div>
  );
}
