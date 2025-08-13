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

    const { 
      name, 
      description, 
      initialPrompt, 
      category = 'other', 
      tags = [], 
      isPublic = false 
    } = req.body;

    // Manual validation according to BotProject schema
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Project name cannot exceed 100 characters'
      });
    }

    if (!initialPrompt || !initialPrompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Initial prompt is required'
      });
    }

    if (initialPrompt.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Initial prompt cannot exceed 1,000 characters'
      });
    }

    if (description && description.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Description cannot exceed 500 characters'
      });
    }

    // Validate category
    const validCategories = ['education', 'ecommerce', 'healthcare', 'finance', 'support', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Create project
    const project = await BotProject.create({
      name: name.trim(),
      description: description?.trim(),
      initialPrompt: initialPrompt.trim(),
      category,
      tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(tag => tag) : [],
      isPublic,
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
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

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
      status,
      search,
      isPublic
    } = req.query;

    // Build query with conditional properties
    const query = {
      owner: req.user.id,
      ...(category && { category }),
      ...(status && { status }),
      ...(isPublic !== undefined && { isPublic: isPublic === 'true' })
    };

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

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

    // Check ownership or if project is public
    if (project.owner._id.toString() !== req.user.id && !project.isPublic) {
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
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

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
    const { 
      name, 
      description, 
      initialPrompt, 
      category, 
      status, 
      tags, 
      isPublic 
    } = req.body;

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

    // Validation for updated fields
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Project name cannot be empty'
        });
      }
      if (name.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Project name cannot exceed 100 characters'
        });
      }
    }

    if (initialPrompt !== undefined) {
      if (!initialPrompt.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Initial prompt cannot be empty'
        });
      }
      if (initialPrompt.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Initial prompt cannot exceed 1,000 characters'
        });
      }
    }

    if (description !== undefined && description.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Description cannot exceed 500 characters'
      });
    }

    // Validate category
    if (category !== undefined) {
      const validCategories = ['education', 'ecommerce', 'healthcare', 'finance', 'support', 'other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
        });
      }
    }

    // Validate status
    if (status !== undefined) {
      const validStatuses = ['draft', 'in_progress', 'completed', 'deployed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Update project with only provided fields
    const updateFields = {};
    
    if (name !== undefined) updateFields.name = name.trim();
    if (description !== undefined) updateFields.description = description?.trim();
    if (initialPrompt !== undefined) updateFields.initialPrompt = initialPrompt.trim();
    if (category !== undefined) updateFields.category = category;
    if (status !== undefined) updateFields.status = status;
    if (isPublic !== undefined) updateFields.isPublic = isPublic;
    if (tags !== undefined) {
      updateFields.tags = Array.isArray(tags) 
        ? tags.map(tag => tag.trim()).filter(tag => tag)
        : [];
    }

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
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

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
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during project deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private
export const getProjectStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await BotProject.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          draftCount: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          inProgressCount: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          deployedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'deployed'] }, 1, 0] }
          },
          publicCount: {
            $sum: { $cond: ['$isPublic', 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalProjects: 0,
      draftCount: 0,
      inProgressCount: 0,
      completedCount: 0,
      deployedCount: 0,
      publicCount: 0
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
