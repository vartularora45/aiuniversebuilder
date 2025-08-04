const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema({
  botId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bot',
    required: true
  },
  type: {
    type: String,
    enum: ['web', 'api', 'slack', 'discord', 'webhook'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error', 'pending'],
    default: 'pending'
  },
  deployedAt: {
    type: Date,
    default: Date.now
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastPing: {
    type: Date
  },
  deployedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for bot queries
deploymentSchema.index({ botId: 1 });

module.exports = mongoose.model('Deployment', deploymentSchema);
