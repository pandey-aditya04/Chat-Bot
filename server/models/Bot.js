import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const botSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['Active', 'Draft', 'Paused'], default: 'Draft' },
  faqs: [faqSchema],
  faqCount: { type: Number, default: 0 },
  conversations: { type: Number, default: 0 },
  created: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

// Update faqCount before saving
botSchema.pre('save', function(next) {
  this.faqCount = this.faqs.length;
  next();
});

const Bot = mongoose.model('Bot', botSchema);

export default Bot;
