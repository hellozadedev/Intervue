"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2 } from "lucide-react";

export default function NotesSection({ title, notes, candidateId, noteType, onNoteAdded }) {
	const [newNote, setNewNote] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleAddNote = async () => {
		if (!newNote.trim() || !candidateId) return;
		setIsLoading(true);

		try {
			const res = await fetch(`/api/candidates/${candidateId}/notes`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type: noteType, note: newNote }),
			});

			const data = await res.json();

			if (res.ok) {
				onNoteAdded(data); // Pass the full updated candidate data
				setNewNote("");
				toast({
					title: "Note Saved",
					description: `${title} updated successfully.`,
				});
			} else {
				toast({
					variant: "destructive",
					title: "Failed to Save Note",
					description: data.message || "An error occurred.",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Could not connect to the server.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<h3 className="text-xl font-semibold font-headline">{title}</h3>
			<div className="space-y-2">
				<Label htmlFor={`${noteType}-notes-textarea`} className="sr-only">
					Add new note for {title}
				</Label>
				<Textarea id={`${noteType}-notes-textarea`} placeholder={`Type your ${noteType.toLowerCase().includes("pre") ? "pre-interview" : "post-interview"} notes here...`} value={newNote} onChange={(e) => setNewNote(e.target.value)} className="min-h-[100px] bg-white shadow-sm" />
				<Button onClick={handleAddNote} disabled={isLoading || !newNote.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
					{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
					Add Note
				</Button>
			</div>
			<Separator />
			{notes && notes.length > 0 ? (
				<ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-background shadow-inner">
					<div className="space-y-3">
						{notes
							.slice()
							.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
							.map((noteItem) => (
								<div key={noteItem._id || noteItem.timestamp} className="p-3 rounded-md bg-secondary/50 shadow-sm">
									<p className="text-sm text-foreground whitespace-pre-wrap">{noteItem.note}</p>
									<p className="text-xs text-muted-foreground mt-1">{format(new Date(noteItem.timestamp), "MMM d, yyyy 'at' h:mm a")}</p>
								</div>
							))}
					</div>
				</ScrollArea>
			) : (
				<p className="text-sm text-muted-foreground italic">No {title.toLowerCase()} yet.</p>
			)}
		</div>
	);
}
