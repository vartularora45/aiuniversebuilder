import mongoose from 'mongoose';

// Schema constants for better maintainability
const NODE_TYPES = ['start', 'question', 'condition', 'action', 'end'];
const ANSWER_TYPES = ['text', 'number', 'boolean', 'choice', 'email', 'phone'];

// Node schema with enhanced validation
const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Node ID is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Node type is required'],
    enum: {
      values: NODE_TYPES,
      message: `Node type must be one of: ${NODE_TYPES.join(', ')}`
    }
  },
  data: {
    label: {
      type: String,
      trim: true,
      maxlength: [200, 'Label cannot exceed 200 characters']
    },
    question: {
      type: String,
      trim: true,
      maxlength: [1000, 'Question cannot exceed 1000 characters']
    },
    expectedAnswerType: {
      type: String,
      enum: {
        values: ANSWER_TYPES,
        message: `Answer type must be one of: ${ANSWER_TYPES.join(', ')}`
      }
    },
    choices: {
      type: [String],
      validate: {
        validator: function(choices) {
          return !choices || choices.length <= 20;
        },
        message: 'Maximum 20 choices allowed'
      }
    },
    conditions: [{
      field: {
        type: String,
        required: true,
        trim: true
      },
      operator: {
        type: String,
        required: true,
        enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'exists', 'complete']
      },
      value: mongoose.Schema.Types.Mixed
    }],
    actions: [{
      type: {
        type: String,
        required: true,
        enum: ['send_message', 'store_data', 'api_call', 'generate_response', 'redirect']
      },
      parameters: mongoose.Schema.Types.Mixed
    }]
  },
  position: {
    x: { 
      type: Number, 
      default: 0,
      min: 0
    },
    y: { 
      type: Number, 
      default: 0,
      min: 0
    }
  },
  style: {
    backgroundColor: {
      type: String,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format']
    },
    borderColor: {
      type: String,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format']
    },
    width: {
      type: Number,
      min: 50,
      max: 500
    },
    height: {
      type: Number,
      min: 30,
      max: 300
    }
  }
}, { _id: false });

// Edge schema with enhanced validation
const edgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Edge ID is required'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Source node is required'],
    trim: true
  },
  target: {
    type: String,
    required: [true, 'Target node is required'],
    trim: true
  },
  label: {
    type: String,
    trim: true,
    maxlength: [100, 'Edge label cannot exceed 100 characters']
  },
  animated: {
    type: Boolean,
    default: false
  },
  style: {
    stroke: {
      type: String,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid stroke color format']
    },
    strokeWidth: {
      type: Number,
      min: 1,
      max: 10,
      default: 2
    }
  }
}, { _id: false });

// Generated questions schema
const generatedQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  context: {
    type: String,
    trim: true,
    maxlength: [1000, 'Context cannot exceed 1000 characters']
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  answered: {
    type: Boolean,
    default: false
  },
  answer: mongoose.Schema.Types.Mixed,
  answeredAt: Date
}, { _id: false });

// Flow configuration schema
const flowConfigurationSchema = new mongoose.Schema({
  startNodeId: {
    type: String,
    required: [true, 'Start node ID is required'],
    trim: true
  },
  endNodeIds: [{
    type: String,
    trim: true
  }],
  variables: [{
    name: {
      type: String,
      required: true,
      trim: true,
      match: [/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Invalid variable name format']
    },
    type: {
      type: String,
      required: true,
      enum: ANSWER_TYPES
    },
    defaultValue: mongoose.Schema.Types.Mixed,
    description: String
  }],
  metadata: {
    totalNodes: {
      type: Number,
      default: 0
    },
    totalEdges: {
      type: Number,
      default: 0
    },
    category: String,
    complexity: {
      type: String,
      enum: ['simple', 'medium', 'complex'],
      default: 'simple'
    }
  }
}, { _id: false });

// Main prompt flow schema
const promptFlowSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BotProject',
    required: [true, 'Project reference is required'],
    index: true
  },
  version: {
    type: Number,
    default: 1,
    min: 1
  },
  nodes: {
    type: [nodeSchema],
    validate: {
      validator: function(nodes) {
        return nodes && nodes.length > 0;
      },
      message: 'At least one node is required'
    }
  },
  edges: [edgeSchema],
  generatedQuestions: [generatedQuestionSchema],
  flowConfiguration: {
    type: flowConfigurationSchema,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
promptFlowSchema.index({ project: 1, version: -1 });
promptFlowSchema.index({ 'project': 1, 'isActive': 1 });
promptFlowSchema.index({ createdAt: -1 });

// Virtual properties
promptFlowSchema.virtual('nodeCount').get(function() {
  return this.nodes?.length || 0;
});

promptFlowSchema.virtual('edgeCount').get(function() {
  return this.edges?.length || 0;
});

promptFlowSchema.virtual('completionRate').get(function() {
  if (!this.generatedQuestions?.length) return 0;
  const answered = this.generatedQuestions.filter(q => q.answered).length;
  return Math.round((answered / this.generatedQuestions.length) * 100);
});

// Instance methods
promptFlowSchema.methods.getStartNode = function() {
  return this.nodes?.find(node => node.type === 'start');
};

promptFlowSchema.methods.getEndNodes = function() {
  return this.nodes?.filter(node => node.type === 'end') || [];
};

promptFlowSchema.methods.validateFlow = function() {
  const errors = [];
  
  // Check for start node
  const startNodes = this.nodes?.filter(node => node.type === 'start') || [];
  if (startNodes.length === 0) {
    errors.push('Flow must have at least one start node');
  } else if (startNodes.length > 1) {
    errors.push('Flow can only have one start node');
  }
  
  // Check for end nodes
  const endNodes = this.nodes?.filter(node => node.type === 'end') || [];
  if (endNodes.length === 0) {
    errors.push('Flow must have at least one end node');
  }
  
  // Validate node connections
  const nodeIds = new Set(this.nodes?.map(node => node.id) || []);
  for (const edge of this.edges || []) {
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge references non-existent source node: ${edge.source}`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge references non-existent target node: ${edge.target}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Static methods
promptFlowSchema.statics.getLatestVersion = function(projectId) {
  return this.findOne({ project: projectId, isActive: true })
    .sort({ version: -1 });
};

promptFlowSchema.statics.getVersionHistory = function(projectId) {
  return this.find({ project: projectId })
    .sort({ version: -1 })
    .select('version createdAt updatedAt tags');
};

// Pre-save middleware
promptFlowSchema.pre('save', function(next) {
  // Update metadata
  if (this.flowConfiguration) {
    this.flowConfiguration.metadata = {
      ...this.flowConfiguration.metadata,
      totalNodes: this.nodes?.length || 0,
      totalEdges: this.edges?.length || 0
    };
  }
  
  // Set answered timestamp for questions
  if (this.generatedQuestions) {
    this.generatedQuestions.forEach(question => {
      if (question.answered && !question.answeredAt) {
        question.answeredAt = new Date();
      }
    });
  }
  
  next();
});

// Create and export model
const PromptFlow = mongoose.model('PromptFlow', promptFlowSchema);

export default PromptFlow;
