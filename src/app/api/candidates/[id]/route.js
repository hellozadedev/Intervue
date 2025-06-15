import dbConnect from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import { getAppSession } from "@/lib/auth";
import { NextResponse } from "next/server";

// Placeholder for GET by ID if needed in the future
// export async function GET(request, { params }) { ... }

export async function PUT(request, { params }) {
	const session = await getAppSession();
	if (!session.user || !session.user.userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	await dbConnect();
	const { id } = params;

	try {
		const body = await request.json();

		const updateData = body;

		if (Object.keys(updateData).length === 0) {
			return NextResponse.json({ message: "No valid fields provided for update." }, { status: 400 });
		}

		const candidate = await Candidate.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

		if (!candidate) {
			return NextResponse.json({ message: "Candidate not found." }, { status: 404 });
		}

		return NextResponse.json(candidate, { status: 200 });
	} catch (error) {
		console.error("Update candidate details error:", error);
		if (error.name === "ValidationError") {
			const messages = Object.values(error.errors).map((val) => val.message);
			return NextResponse.json({ message: messages.join(", ") }, { status: 400 });
		}
		return NextResponse.json({ message: "Server error while updating candidate details." }, { status: 500 });
	}
}
