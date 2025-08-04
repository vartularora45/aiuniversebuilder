import Workspace from '../db/';
import User from '../models/User.js';

// Create workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Workspace name is required',
      });
    }

    const workspace = new Workspace({
      name,
      description,
      members: [
        {
          userId: req.user._id,
          role: 'owner',
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
      'members.userId': req.user._id,
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
      'members.userId': req.user._id,
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
