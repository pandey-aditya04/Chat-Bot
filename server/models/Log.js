import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['bot', 'user'], required: true },
  text: { type: String, required: true },
  time: { type: String },
  matched: { type: Boolean }
});

const logSchema = new mongoose.Schema({
  botId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
  botName: { type: String },
  sessionId: { type: String },
  date: { type: String, default: () => new Date().toISOString().replace('T', ' ').slice(0, 16) },
  messageCount: { type: Number, default: 0 },
  messages: [messageSchema]
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);

export default Log;
