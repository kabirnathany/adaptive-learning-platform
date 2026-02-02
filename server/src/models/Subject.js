import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, enum: ['Math', 'English', 'Science'] },
  gradeLevels: [{ type: String, enum: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] }],
  description: String,
}, { timestamps: true });

export const Subject = mongoose.model('Subject', subjectSchema);
