// models/ConversationLog.js
const mongoose = require('mongoose');

const ConversationLogSchema = new mongoose.Schema({
  botId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot', required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  sessionType: { type: String, enum: ['preview', 'live'], default: 'preview' },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

module.exports = mongoose.model('ConversationLog', ConversationLogSchema);
