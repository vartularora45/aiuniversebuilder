const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  prompt: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  llmProvider: {
    type: String,
    enum: ['openai', 'anthropic', 'google', 'azure'],
    default: 'openai'
  },
  config: {
    model: {
      type: String,
      default: 'gpt-3.5-turbo'
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2
    },
    maxTokens: {
      type: Number,
      default: 4
    },
    topP: {
      type: Number,
      default: 1
    }
  },
  status: {
    type: String,
    enum: ['draft', 'training', 'active', 'inactive', 'error'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for workspace queries
botSchema.index({ workspaceId: 1 });

module.exports = mongoose.model('Bot', botSchema);
