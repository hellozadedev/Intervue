'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NotesSection from './NotesSection';
import StarRatingInput from './StarRatingInput';
import { Mail, UserCircle, Briefcase, Info } from 'lucide-react';

export default function CandidateDisplay({ candidate, onUpdateCandidate }) {
  if (!candidate) {
    return (
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center font-headline"><Info className="mr-2 h-6 w-6 text-primary" />No Candidate Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Search for a candidate by email to view their details.</p>
        </CardContent>
      </Card>
    );
  }
  
  const handleNoteAdded = (updatedCandidate) => {
    onUpdateCandidate(updatedCandidate);
  };

  const handleRatingSaved = (newRating) => {
    onUpdateCandidate({ ...candidate, rating: newRating });
  };

  return (
    <Card className="mt-6 shadow-xl w-full">
      <CardHeader className="bg-primary/10 rounded-t-lg p-6">
        <CardTitle className="text-3xl font-headline text-primary flex items-center">
          <UserCircle className="mr-3 h-8 w-8" />
          {candidate.name}
        </CardTitle>
        <CardDescription className="text-base text-primary/80 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <span className="flex items-center"><Mail className="mr-2 h-4 w-4" /> {candidate.email}</span>
          <span className="flex items-center mt-1 sm:mt-0"><Briefcase className="mr-2 h-4 w-4" /> Position: {candidate.position}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <NotesSection
            title="Pre-Interview Notes"
            notes={candidate.preInterviewNotes}
            candidateId={candidate._id}
            noteType="preInterview"
            onNoteAdded={handleNoteAdded}
          />
        </div>
        <div className="space-y-6">
          <NotesSection
            title="Post-Interview Notes"
            notes={candidate.postInterviewNotes}
            candidateId={candidate._id}
            noteType="postInterview"
            onNoteAdded={handleNoteAdded}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-xl font-semibold font-headline">Candidate Rating</h3>
           <StarRatingInput 
            currentRating={candidate.rating} 
            candidateId={candidate._id}
            onRatingSaved={handleRatingSaved}
          />
          {candidate.rating !== null && candidate.rating !== undefined && (
            <p className="text-sm text-muted-foreground">Current rating: {candidate.rating} / 5</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
