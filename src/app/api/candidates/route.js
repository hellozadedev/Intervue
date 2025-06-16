import dbConnect from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import { getAppSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
	const session = await getAppSession();
	if (!session.user || !session.user.userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	await dbConnect();

	try {
		// Sort by rating descending (non-null ratings first), then by name ascending as a secondary sort.
		// MongoDB's sort treats nulls as the smallest value, so for descending sort, they come last.
		const candidates = await Candidate.find({ rating: { $gt: 4 } })
			.sort({ rating: -1, name: 1 })
			.select("-preInterviewNotes -postInterviewNotes"); // Optionally exclude notes for brevity in list view

		return NextResponse.json(candidates, { status: 200 });
	} catch (error) {
		console.error("Fetch all candidates error:", error);
		return NextResponse.json({ message: "Server error while fetching candidates." }, { status: 500 });
	}
}
