import mongoose from 'mongoose';

const learningMaterialSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  type: { type: String, enum: ['text', 'video', 'link'], required: true },
  title: { type: String, required: true },
  content: { type: String },
  url: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

learningMaterialSchema.index({ topicId: 1 });

export const LearningMaterial = mongoose.model('LearningMaterial', learningMaterialSchema);
