'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function StarRatingInput({ currentRating, onRatingChange, candidateId, onRatingSaved }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating || 0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedRating(currentRating || 0);
  }, [currentRating]);

  const handleSaveRating = async () => {
    if (!candidateId || selectedRating === null) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/candidates/${candidateId}/rating`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: selectedRating }),
      });
      if (res.ok) {
        const updatedCandidate = await res.json();
        onRatingSaved(updatedCandidate.rating); // Pass the new rating back
      } else {
        // Handle error (e.g., show toast)
        console.error("Failed to save rating");
      }
    } catch (error) {
      console.error("Error saving rating:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-8 w-8 cursor-pointer transition-colors",
              (hoverRating || selectedRating) >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
            )}
            onClick={() => {
              const newRating = star === selectedRating ? 0 : star; // Allow deselecting or setting to 0
              setSelectedRating(newRating);
              if (onRatingChange) onRatingChange(newRating);
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          />
        ))}
      </div>
       {selectedRating !== currentRating && (
        <Button onClick={handleSaveRating} disabled={isLoading || selectedRating === null} size="sm" variant="outline">
          {isLoading ? "Saving..." : `Save ${selectedRating}-Star Rating`}
        </Button>
      )}
    </div>
  );
}
