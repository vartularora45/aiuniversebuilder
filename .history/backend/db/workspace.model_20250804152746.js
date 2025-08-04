import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Workspace name must be at least 3 characters long'],
      maxlength: [50, 'Workspace name cannot exceed 50 characters']
    },
    description: {
      type: String,q
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'organization'],
      default: 'private'
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['owner', 'admin', 'member', 'viewer'],
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        lastActive: {
          type: Date,
          default: Date.now,
        },
        permissions: {
          canInvite: { type: Boolean, default: false },
          canRemoveMembers: { type: Boolean, default: false },
          canEditWorkspace: { type: Boolean, default: false }
        }
      },
    ],
    stats: {
      totalProjects: { type: Number, default: 0 },
      activeProjects: { type: Number, default: 0 },
      totalTasks: { type: Number, default: 0 },
      completedTasks: { type: Number, default: 0 }
    },
    settings: {
      allowGuestAccess: { type: Boolean, default: false },
      defaultMemberRole: { 
        type: String, 
        enum: ['member', 'viewer'], 
        default: 'member' 
      },
      notificationSettings: {
        memberJoined: { type: Boolean, default: true },
        memberLeft: { type: Boolean, default: true },
        roleChanged: { type: Boolean, default: true }
      }
    },
    tags: [{ type: String, trim: true }],
    lastActive: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
workspaceSchema.index({ 'members.userId': 1 });
workspaceSchema.index({ name: 'text', description: 'text' });
workspaceSchema.index({ visibility: 1 });
workspaceSchema.index({ lastActive: -1 });
workspaceSchema.index({ tags: 1 });

// Virtual for member count
workspaceSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for active members (active in last 30 days)
workspaceSchema.virtual('activeMembers').get(function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.members.filter(member => member.lastActive >= thirtyDaysAgo).length;
});

// Method to check if user is member
workspaceSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.userId.toString() === userId.toString());
};

// Method to check user role
workspaceSchema.methods.getUserRole = function(userId) {
  const member = this.members.find(m => m.userId.toString() === userId.toString());
  return member ? member.role : null;
};

const Workspace = model('Workspace', workspaceSchema);

export default Workspace;
