import mongoose from 'mongoose';

const userMasterySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  score: { type: Number, default: 0, min: 0, max: 100 },
  attempts: { type: Number, default: 0 },
  lastAttemptAt: { type: Date },
}, { timestamps: true });

userMasterySchema.index({ userId: 1, topicId: 1 }, { unique: true });

export const UserMastery = mongoose.model('UserMastery', userMasterySchema);
