import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedIndex: { type: Number, required: true },
  correct: { type: Boolean, required: true },
  timeSpentMs: { type: Number, default: 0 },
}, { _id: false });

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  type: { type: String, enum: ['initial', 'adaptive'], required: true },
  answers: [answerSchema],
  scorePercent: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

quizResultSchema.index({ userId: 1, completedAt: -1 });
quizResultSchema.index({ userId: 1, subjectId: 1 });

export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
