// models/Bot.js
imp

const BotSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  name: { type: String, required: true },
  description: { type: String },
  prompt: { type: String, required: true },
  avatarUrl: { type: String },
  sampleQuestions: [{ type: String }],
  llmProvider: { type: String, default: 'openai' },
  config: {
    temperature: { type: Number, default: 0.7 },
    maxTokens: { type: Number, default: 50 }
    // Extend as needed
  },
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bot', BotSchema);
