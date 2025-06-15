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

	const { searchParams } = new URL(request.url);
	const email = searchParams.get("email");

	if (!email) {
		return NextResponse.json({ message: "Email query parameter is required." }, { status: 400 });
	}

	try {
		const candidate = await Candidate.findOne({ Email: email });
		if (!candidate) {
			return NextResponse.json({ message: "Candidate not found." }, { status: 404 });
		}
		return NextResponse.json(candidate, { status: 200 });
	} catch (error) {
		console.error("Search candidate error:", error);
		return NextResponse.json({ message: "Server error while fetching candidate." }, { status: 500 });
	}
}
