import mongoose from 'mongoose';

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

const CandidateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide candidate email.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address.'],
  },
  name: {
    type: String,
    required: [true, 'Please provide candidate name.'],
  },
  position: {
    type: String,
    default: 'N/A',
  },
  preInterviewNotes: [NoteSchema],
  postInterviewNotes: [NoteSchema],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: null,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

CandidateSchema.pre('save', function(next) {
  this.lastUpdatedAt = Date.now();
  next();
});


export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
