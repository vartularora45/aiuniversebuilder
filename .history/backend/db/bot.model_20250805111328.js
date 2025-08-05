const mongoose = require('mongoose');

const botProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  initialPrompt: {
    type: String,
    required: [true, 'Initial prompt is required'],
    maxlength: [1000, 'Initial prompt cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['education', 'ecommerce', 'healthcare', 'finance', 'support', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['draft', 'in_progress', 'completed', 'deployed'],
    default: 'draft'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better query performance
botProjectSchema.index({ owner: 1, createdAt: -1 });
botProjectSchema.index({ category: 1 });

module.exports = mongoose.model('BotProject', botProjectSchema);
