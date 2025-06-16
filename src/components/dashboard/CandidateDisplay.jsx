"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NotesSection from "./NotesSection";
import StarRatingInput from "./StarRatingInput";
import { Mail, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { format } from "date-fns";

const editableFieldsConfig = [
	{ name: "salaryExpectation", label: "Salary Expectation", type: "text" },
	{ name: "yearsExperience", label: "Years of Experience", type: "text" },
	{ name: "figmaToHtml", label: "Figma To HTML", type: "text" },
	{ name: "php_knowladge", label: "PHP Knowladge", type: "text" },
	{ name: "automation", label: "Automation (N8N)", type: "text" },
	{ name: "ai_ml", label: "AI/ML", type: "text" },
	{ name: "cloud", label: "Cloud", type: "text" },
];
export default function CandidateDisplay({ candidate, onUpdateCandidate }) {
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

	const handleNoteAdded = (updatedCandidate) => {
		onUpdateCandidate(updatedCandidate);
	};

	const handleRatingSaved = (newRating) => {
		onUpdateCandidate({ ...candidate, rating: newRating });
	};
	const [formData, setFormData] = useState(candidate);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		if (candidate) {
			const initialData = {};
			editableFieldsConfig.forEach((field) => {
				if (field.type === "date" && candidate[field.name]) {
					try {
						initialData[field.name] = format(new Date(candidate[field.name]), "yyyy-MM-dd");
					} catch (e) {
						initialData[field.name] = ""; // Set to empty if date is invalid
					}
				} else {
					initialData[field.name] = candidate[field.name] !== undefined && candidate[field.name] !== null ? String(candidate[field.name]) : "";
				}
			});
			setFormData(initialData);
		}
	}, [candidate]);

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "number" && value !== "" ? Number(value) : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		// Prepare data, converting empty strings to null for optional fields if necessary,
		// or handle type conversions (e.g., string to number for salary/experience)
		const payload = { ...candidate, ...formData };
		editableFieldsConfig.forEach((field) => {
			if (field.type === "number" && payload[field.name] === "") {
				payload[field.name] = null; // Or handle as per backend requirement for empty numbers
			}
			// Ensure numbers are numbers
			if (field.type === "number" && payload[field.name] !== null && payload[field.name] !== undefined) {
				const numVal = parseFloat(payload[field.name]);
				payload[field.name] = isNaN(numVal) ? null : numVal;
			}
			if (field.type === "date" && payload[field.name] === "") {
				payload[field.name] = null;
			}
		});

		try {
			const res = await fetch(`/api/candidates/${candidate._id}`, {
				// Adjusted API endpoint
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (res.ok) {
				toast({
					title: "Update Successful",
					description: `${candidate.Name}'s details have been updated.`,
				});
			} else {
				toast({
					variant: "destructive",
					title: "Update Failed",
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

	const renderField = (field) => {
		const commonProps = {
			id: field.name,
			name: field.name,
			value: formData[field.name] || "",
			onChange: handleChange,
			className: "bg-background",
			required: field.required,
		};

		if (field.type === "textarea") {
			return <Textarea {...commonProps} placeholder={field.label} rows={field.rows || 3} />;
		}
		return <Input {...commonProps} type={field.type} placeholder={field.type === "number" ? "Enter number" : field.label} />;
	};

	return (
		<Card className="mt-6 shadow-xl w-full">
			<CardHeader className="bg-primary/10 rounded-t-lg p-6">
				<CardTitle className="text-3xl font-headline text-primary flex items-center">
					{candidate.Name} [{candidate.ID}]
				</CardTitle>
				<CardDescription className="text-base text-primary/80 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
					<span className="flex items-center">
						<Mail className="mr-2 h-4 w-4" /> {candidate.Email}
					</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="p-6 grid gap-8 md:grid-cols-2">
				<div className="space-y-6">
					<NotesSection title="Pre-Interview Notes" notes={candidate.preInterviewNotes} candidateId={candidate._id} noteType="preInterview" onNoteAdded={handleNoteAdded} />
				</div>
				<div className="space-y-6">
					<NotesSection title="Post-Interview Notes" notes={candidate.postInterviewNotes} candidateId={candidate._id} noteType="postInterview" onNoteAdded={handleNoteAdded} />
				</div>
				<div className="md:col-span-2 space-y-2">
					<h3 className="text-xl font-semibold font-headline">Candidate Rating</h3>
					<StarRatingInput currentRating={candidate.rating} candidateId={candidate._id} onRatingSaved={handleRatingSaved} />
					{candidate.rating !== null && candidate.rating !== undefined && <p className="text-sm text-muted-foreground">Current rating: {candidate.rating} / 10</p>}
				</div>
				<div className="md:col-span-2 space-y-2">
					<form className="space-y-4" onSubmit={handleSubmit}>
						{/* Adjust height as needed */}
						<div className="p-1 grid grid-cols-3 gap-4">
							{editableFieldsConfig.map((field) => (
								<div key={field.name} className="space-y-1 mt-0">
									<Label htmlFor={field.name} className="text-sm font-medium">
										{field.label} {field.required && <span className="text-destructive">*</span>}
									</Label>
									{renderField(field)}
								</div>
							))}
						</div>

						<div className="flex justify-end space-x-2 pt-4 border-t">
							<Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
								{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
								Save Changes
							</Button>
						</div>
					</form>
				</div>
			</CardContent>
		</Card>
	);
}
