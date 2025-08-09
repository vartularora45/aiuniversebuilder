import { validationResult } from 'express-validator';
import BotProject from '../db/bot.model.js';
import PromptFlow from '../db/prompt.model.js';

// @desc    Create new bot project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, initialPrompt, category, tags } = req.body;

    // Create project
    const project = await BotProject.create({
      name,
      description,
      initialPrompt,
      category,
      tags,
      owner: req.user.id
    });

    // Create initial prompt flow with configuration
    const initialFlowConfig = {
      startNodeId: 'start-node',
      endNodeIds: [],
      variables: []
    };

    const initialFlow = await PromptFlow.create({
      project: project._id,
      nodes: [
        {
          id: 'start-node',
          type: 'start',
          data: {
            label: 'Start',
            question: initialPrompt
          },
          position: { x: 250, y: 50 }
        }
      ],
      edges: [],
      flowConfiguration: initialFlowConfig
    });

    // Populate owner info
    await project.populate('owner', 'username email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project,
        flow: initialFlow
      }
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during project creation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



// @desc    Get user's projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status 
    } = req.query;

    // Build query with conditional properties
    const query = {
      owner: req.user.id,
      ...(category && { category }),
      ...(status && { status })
    };

    // Parse pagination values
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [projects, total] = await Promise.all([
      BotProject.find(query)
        .populate('owner', 'username email')
        .sort({ updatedAt: -1 })
        .limit(limitNum)
        .skip(skip),
      BotProject.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await BotProject.findById(id)
      .populate('owner', 'username email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.owner._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    // Get associated flow (latest version)
    const flow = await PromptFlow.findOne({ project: project._id })
      .sort({ version: -1 });

    res.json({
      success: true,
      data: {
        project,
        flow
      }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, status, tags } = req.body;

    let project = await BotProject.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Update project with only provided fields
    const updateFields = {
      ...(name && { name }),
      ...(description && { description }),
      ...(category && { category }),
      ...(status && { status }),
      ...(tags && { tags })
    };

    project = await BotProject.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('owner', 'username email');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project }
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during project update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await BotProject.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Delete associated flows and project in parallel
    await Promise.all([
      PromptFlow.deleteMany({ project: project._id }),
      BotProject.findByIdAndDelete(id)
    ]);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during project deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
