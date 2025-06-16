"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CandidateDisplay from "./CandidateDisplay";
import CandidateDataDisplay from "./CandidateDataDisplay";
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2, LogOut, Users, Star, ExternalLink, X, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
export default function DashboardClient({ user }) {
	const [searchEmail, setSearchEmail] = useState("");
	const [candidate, setCandidate] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [notFound, setNotFound] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const [allCandidates, setAllCandidates] = useState([]);
	const [isCandidateListLoading, setIsCandidateListLoading] = useState(true);
	useEffect(() => {
		const fetchCandidates = async () => {
			setIsCandidateListLoading(true);
			try {
				const res = await fetch("/api/candidates");
				if (res.ok) {
					const data = await res.json();
					setAllCandidates(data);
				} else {
					toast({
						variant: "destructive",
						title: "Failed to Load Candidates",
						description: "Could not fetch the list of candidates.",
					});
				}
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Error",
					description: "Could not connect to the server to load candidates.",
				});
			} finally {
				setIsCandidateListLoading(false);
			}
		};
		fetchCandidates();
	}, [toast]);
	const handleSearch = async (e) => {
		e && e.preventDefault();
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
		setAllCandidates((prev) => prev.map((c) => (c._id === updatedCandidate._id ? updatedCandidate : c)));
	};

	const handleLogout = async () => {
		try {
			const res = await fetch("/api/auth/logout", { method: "POST" });
			if (res.ok) {
				toast({ title: "Logged Out", description: "You have been successfully logged out." });
				router.push("/login");
				router.refresh(); // To ensure server-side state is updated
			} else {
				const data = await res.json();
				toast({ variant: "destructive", title: "Logout Failed", description: data.message || "Could not log out." });
			}
		} catch (error) {
			toast({ variant: "destructive", title: "Logout Failed", description: "Could not log out." });
		}
	};

	const renderRatingStars = (rating) => {
		if (rating === null || rating === undefined) return <span className="text-muted-foreground text-xs">Not Rated</span>;
		const stars = [];
		for (let i = 1; i <= 10; i++) {
			stars.push(<Star key={i} className={`h-4 w-4 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />);
		}
		return <div className="flex items-center">{stars}</div>;
	};
	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8">
			<header className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold font-headline text-primary">Intervue Dashboard</h1>
					{user && <p className="text-sm text-muted-foreground">Welcome, {user.email}</p>}
				</div>
				<Button variant="outline" onClick={handleLogout} className=" bg-black text-white">
					<LogOut className="mr-2 h-4 w-4" /> Logout
				</Button>
			</header>

			<div>
				<Button
					type="button"
					className="bg-accent hover:bg-accent/90 text-accent-foreground fixed bottom-16 right-8"
					onClick={() => {
						window.scrollTo({
							top: 0,
							behavior: "smooth",
						});
					}}
				>
					<ChevronUp className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					disabled={isLoading}
					className="bg-black hover:bg-black/90 text-accent-foreground fixed bottom-4 right-4"
					onClick={() => {
						setSearchEmail("");
						setCandidate(null);
						setNotFound(false);
						window.scrollTo({
							top: 200,
							behavior: "smooth",
						});
					}}
				>
					{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
					Clear
				</Button>
			</div>

			<Card className="mb-8 shadow-lg">
				<CardHeader>
					<CardTitle className="font-headline text-2xl">Search Candidate</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSearch} className="flex items-center space-x-2">
						<Label htmlFor="search-email" className="sr-only">
							Search by Email
						</Label>
						<Input id="search-email" type="email" placeholder="Candidate's email address" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} required className="flex-grow bg-white" />
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

			{candidate && <CandidateDisplay candidate={candidate} onUpdateCandidate={handleUpdateCandidate} />}

			{candidate && <CandidateDataDisplay candidate={candidate} />}

			<Card className="mt-12 shadow-xl">
				<CardHeader>
					<CardTitle className="font-headline text-2xl flex items-center">
						<Users className="mr-2 h-6 w-6" />
						All Candidates
					</CardTitle>
					<CardDescription>List of all candidates, sorted by rating (highest first).</CardDescription>
				</CardHeader>
				<CardContent>
					{isCandidateListLoading ? (
						<div className="flex justify-center items-center py-10">
							<Loader2 className="h-12 w-12 animate-spin text-primary" />
						</div>
					) : allCandidates.length > 0 ? (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Salary Expectation</TableHead>
										<TableHead className="text-center">Rating</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{allCandidates.map((c) => (
										<TableRow key={c._id}>
											<TableCell className="font-medium">{c.Name}</TableCell>
											<TableCell>{c.Email}</TableCell>
											<TableCell>{c.salaryExpectation}</TableCell>
											<TableCell className="text-center">{renderRatingStars(c.rating)}</TableCell>
											<TableCell className="text-right">
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setSearchEmail(c.Email);

														setCandidate(c);
														window.scrollTo({
															top: 200,
															behavior: "smooth",
														});
													}}
												>
													View Profile <ExternalLink className="ml-2 h-3 w-3" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<p className="text-muted-foreground text-center py-10">No candidates found.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
