import Workspace from '../db/workspace.model.js';
import User from '../db/user.model.js';

const ITEMS_PER_PAGE = 10;

// Input validation middleware
const validateWorkspaceInput = (name, description) => {
  const errors = [];
  if (!name || name.trim().length < 3) {
    errors.push('Workspace name must be at least 3 characters long');
  }
  if (description && description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  return errors;
};

// Create workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name, description, visibility = 'private' } = req.body;

    // Enhanced input validation
    const validationErrors = validateWorkspaceInput(name, description);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    // console.log('req.user:', req.user);
    // Check for existing workspace with same name for this user
    const existingWorkspace = await Workspace.findOne({
      'members.userId': req.user.id,
      name: name,
      isActive: true
    });

    if (existingWorkspace) {
      return res.status(400).json({
        success: false,
        message: 'You already have a workspace with this name'
      });
    }

    const workspace = new Workspace({
      name,
      description,
      visibility,
      createdAt: new Date(),
      lastActive: new Date(),
      stats: {
        memberCount: 1,
        totalProjects: 0,
        activeProjects: 0
      },
      members: [
        {
          userId: req.user.id,
          role: 'owner',
          joinedAt: new Date(),
          lastActive: new Date()
        },
      ],
    });

    await workspace.save();
    await workspace.populate('members.userId', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      data: { workspace },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating workspace',
      error: error.message,
    });
  }
};

// Get all workspaces of user
export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      'members.userId': req.user.id,
      isActive: true,
    }).populate('members.userId', 'name email avatar');

    res.json({
      success: true,
      data: { workspaces },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workspaces',
      error: error.message,
    });
  }
};

// Get a single workspace by ID
export const getWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': req.user.id,
      isActive: true,
    }).populate('members.userId', 'name email avatar');

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found or access denied',
      });
    }

    res.json({
      success: true,
      data: { workspace },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workspace',
      error: error.message,
    });
  }
};
export const getWorkspaceByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
    
        const workspaces = await Workspace.find({
        'members.userId': userId,
        isActive: true,
        }).populate('members.userId', 'name email avatar');
    
        // Check if any workspaces were found for the given userId
        // If none found, return a 404 response
        if (!workspaces || workspaces.length === 0) {
            return res.status(404).json({
            success: false,
            message: 'No workspaces found for this user',
            });
        }
        // Otherwise, continue to send the workspaces in the response below
    
        res.json({
        success: true,
        data: { workspaces },
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error fetching workspaces',
        error: error.message,
        });
    }
}

// Update workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description } = req.body;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': req.user._id,
      'members.role': { $in: ['owner', 'admin'] },
      isActive: true,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found or insufficient permissions',
      });
    }

    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;

    await workspace.save();
    await workspace.populate('members.userId', 'name email avatar');

    res.json({
      success: true,
      message: 'Workspace updated successfully',
      data: { workspace },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating workspace',
      error: error.message,
    });
  }
};

// Add member to workspace
export const addMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role = 'member' } = req.body;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': req.user._id,
      'members.role': { $in: ['owner', 'admin'] },
      isActive: true,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found or insufficient permissions',
      });
    }

    const userToAdd = await User.findOne({ email, isActive: true });
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const existingMember = workspace.members.find(
      (member) => member.userId.toString() === userToAdd._id.toString()
    );

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this workspace',
      });
    }

    workspace.members.push({ userId: userToAdd._id, role });

    await workspace.save();
    await workspace.populate('members.userId', 'name email avatar');

    res.json({
      success: true,
      message: 'Member added successfully',
      data: { workspace },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding member',
      error: error.message,
    });
  }
};
