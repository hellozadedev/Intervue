"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define which fields are editable and their properties
const editableFieldsConfig = [
	{ name: "name", label: "Full Name", type: "text", required: true },
	{ name: "position", label: "Position Applied For", type: "text" },
	{ name: "status", label: "Status", type: "text" },
	{ name: "candidateID", label: "Candidate ID (Numeric)", type: "number" },
	{ name: "submissionDate", label: "Submission Date", type: "date" },
	{ name: "salaryExpectation", label: "Salary Expectation", type: "number" },
	{ name: "yearsExperience", label: "Years of Experience", type: "number" },
	{ name: "linkedInProfile", label: "LinkedIn Profile URL", type: "url" },
	{ name: "cvLink", label: "CV Link/File Name", type: "text" },
	{ name: "codingTestProjectLink", label: "Coding Test Project URL", type: "url" },
	{ name: "githubRepoLink", label: "GitHub Repository URL", type: "url" },
	{ name: "projectDescription", label: "Project Description", type: "textarea", rows: 3 },
	{ name: "selfDescription", label: "Self Description", type: "textarea", rows: 3 },
	{ name: "programmingLanguage", label: "Primary Programming Language", type: "text" },
	{ name: "recentLearning", label: "Recent Learning", type: "textarea", rows: 2 },
	{ name: "futureLearningPlans", label: "Future Learning Plans", type: "textarea", rows: 2 },
	{ name: "dbKnowledge", label: "Database Knowledge", type: "textarea", rows: 2 },
	{ name: "quickReactionScenario", label: "Quick Reaction Scenario Response", type: "textarea", rows: 2 },
	{ name: "frontendPreference", label: "Frontend Preference", type: "textarea", rows: 2 },
	{ name: "projectSuggestion", label: "Project Suggestion", type: "textarea", rows: 2 },
];

export default function CandidateEditForm({ candidate, onSave, onCancel }) {
	const [formData, setFormData] = useState({});
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
		const payload = { ...formData };
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
					description: `${candidate.name}'s details have been updated.`,
				});
				onSave(data); // Pass updated candidate data back
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
				<CardTitle className="text-3xl font-headline text-primary flex items-center">Update Notes</CardTitle>
			</CardHeader>
			<CardContent className="p-6 grid gap-8 md:grid-cols-2">
				<form className="space-y-4">
					<ScrollArea className="h-[65vh] pr-3">
						{/* Adjust height as needed */}
						<div className="space-y-4 p-1">
							{editableFieldsConfig.map((field) => (
								<div key={field.name} className="space-y-1">
									<Label htmlFor={field.name} className="text-sm font-medium">
										{field.label} {field.required && <span className="text-destructive">*</span>}
									</Label>
									{renderField(field)}
								</div>
							))}
						</div>
					</ScrollArea>
					<div className="flex justify-end space-x-2 pt-4 border-t">
						<Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
							{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
							Save Changes
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
