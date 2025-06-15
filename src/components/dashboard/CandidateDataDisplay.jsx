"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NotesSection from "./NotesSection";
import StarRatingInput from "./StarRatingInput";
import { Mail, UserCircle, Briefcase, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export default function CandidateDisplay({ candidate }) {
	if (!candidate) {
		return (
			<Card className="mt-6 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center font-headline">
						<Info className="mr-2 h-6 w-6 text-primary" />
						No Candidate Selected
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Search for a candidate by email to view their details.</p>
				</CardContent>
			</Card>
		);
	}
	const excludedKeys = ["preInterviewNotes", "updatedAt", "postInterviewNotes", "Name", "Email", "Status", "Date", "ID", "_id", "rating"];

	return (
		<Card className="mt-6 shadow-xl w-full">
			<CardHeader className="bg-primary/10 rounded-t-lg p-6">
				<CardTitle className="text-3xl font-headline text-primary flex items-center">All Data</CardTitle>
			</CardHeader>
			<CardContent className="p-6 grid gap-8 grid-cols-1">
				<ul>
					{Object.entries(candidate)
						.filter(([key]) => !excludedKeys.includes(key))
						.map(([key, value]) => (
							<li key={key} className="[&:not(:first-child)]:mt-5">
								<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{key}</h4>
								<blockquote className="mt-3 border-l-2 pl-6 italic">
									<div style={{ whiteSpace: "pre-line" }}>{value}</div>
								</blockquote>
							</li>
						))}
				</ul>
			</CardContent>
		</Card>
	);
}
