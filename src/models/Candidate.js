import mongoose from "mongoose";

// Notes schema
const NoteSchema = new mongoose.Schema({
	note: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

// Main Candidate schema with exact field names as per your example
const CandidateSchema = new mongoose.Schema(
	{
		ID: {
			type: Number,
			required: true,
		},
		Status: {
			type: String,
			default: "pending",
		},
		Date: {
			type: Date,
		},
		Coding_Test_Project_Link: {
			type: String,
		},
		Please_briefly_describe_the_steps_you_followed_to_complete_the_project: {
			type: String,
		},
		GitHub_Public_Repository_Link_Of_Coding_Test_Project: {
			type: String,
		},
		Name: {
			type: String,
			required: [true, "Please provide candidate name."],
		},
		Email: {
			type: String,
			required: [true, "Please provide candidate email."],
			unique: true,
			match: [/.+\@.+\..+/, "Please fill a valid email address."],
		},
		CV: {
			type: String,
		},
		Tell_us_who_you_are_in_a_few_lines: {
			type: String,
		},
		Programming_Langauge: {
			type: String,
		},
		Experience: {
			type: String,
		},
		Name_one_thing_you_learned_recently_and_why: {
			type: String,
		},
		What_are_your_learning_plans_in_future: {
			type: String,
		},
		DB_Knowledge: {
			type: String,
		},
		Quick_Reaction: {
			type: String,
		},
		Frontend_View: {
			type: String,
		},
		Suggestion: {
			type: String,
		},
		Your_Salary_Expectation: {
			type: String,
		},
		Your_LinkedIn_Profile: {
			type: String,
		},

		// Keep your internal fields
		preInterviewNotes: [NoteSchema],
		postInterviewNotes: [NoteSchema],
		rating: {
			type: Number,
			min: 0,
			max: 10,
			default: null,
		},

		salaryExpectation: {
			type: String,
		},

		yearsExperience: {
			type: String,
		},

		figmaToHtml: {
			type: String,
		},

		php_knowladge: {
			type: String,
		},

		automation: {
			type: String,
		},

		ai_ml: {
			type: String,
		},
		cloud: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);
