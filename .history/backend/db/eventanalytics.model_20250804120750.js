const mongoose = require('mongoose');

const eventAnalyticsSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['message', 'deployment', 'training', 'error', 'usage'],
    required: true
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
eventAnalyticsSchema.index({ botId: 1, createdAt: -1 });
eventAnalyticsSchema.index({ workspaceId: 1, type: 1 });

module.exports = mongoose.model('EventAnalytics', eventAnalyticsSchema);
