const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  revoked: {
    type: Boolean,
    default: false
  },
  lastUsed: {
    type: Date
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'deploy', 'admin']
  }],
  expiresAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for workspace and key lookups
apiKeySchema.index({ workspaceId: 1 });
apiKeySchema.index({ key: 1 });

module.exports = mongoose.model('ApiKey', apiKeySchema);
