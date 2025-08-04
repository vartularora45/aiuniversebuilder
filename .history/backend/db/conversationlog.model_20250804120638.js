const mongoose = require('mongoose');

const conversationLogSchema = new mongoose.Schema({
  botId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bot',
    required: true
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  startedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  sessionType: {
    type: String,
    enum: ['web', 'api', 'slack', 'test'],
    default: 'web'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    sessionId: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
conversationLogSchema.index({ botId: 1, startedAt: -1 });
conversationLogSchema.index({ workspaceId: 1 });

module.exports = mongoose.model('ConversationLog', conversationLogSchema);
