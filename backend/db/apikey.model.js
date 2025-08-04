// models/ApiKey.js
const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  key: { type: String, required: true, unique: true },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date }
});

module.exports = mongoose.model('ApiKey', ApiKeySchema);
