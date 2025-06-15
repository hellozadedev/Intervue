import DashboardClient from "@/components/dashboard/DashboardClient";
import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth";

export default async function DashboardPage() {
	const session = await getAppSession();

	if (!session || !session.user || !session.user.userId) {
		// If no active session or user data in session, redirect to login
		redirect("/login?reason=session_expired_or_invalid");
	}

	// If session is valid, render the client component
	return <main className="min-h-screen bg-gradient-to-br from-background to-primary/10">{session && <DashboardClient user={session.user} />}</main>;
}
