import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  gradeLevel: { type: String, required: true, enum: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
  name: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

topicSchema.index({ subjectId: 1, gradeLevel: 1 });

export const Topic = mongoose.model('Topic', topicSchema);
