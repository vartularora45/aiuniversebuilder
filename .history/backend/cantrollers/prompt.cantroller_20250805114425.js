import { validationResult } from 'express-validator';
import BotProject from '../db/bot.model.js';
import PromptFlow from '../db/prompt.model.js';
import aiService from '../ui';

// @desc    Generate questions based on prompt
// @route   POST /api/prompts/generate-questions
// @access  Private
export const generateQuestions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { prompt, context = {}, projectId } = req.body;

    // Verify project ownership if projectId is provided
    if (projectId) {
      const project = await BotProject.findById(projectId);
      if (!project || project.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this project'
        });
      }
    }

    // Generate questions using AI service
    const questions = await aiService.generateQuestions(prompt, context);

    res.json({
      success: true,
      message: 'Questions generated successfully',
      data: {
        questions,
        prompt,
        context
      }
    });

  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Save prompt flow
// @route   POST /api/prompts/save-flow/:projectId
// @access  Private
export const savePromptFlow = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { projectId } = req.params;
    const { nodes, edges, generatedQuestions, flowConfiguration } = req.body;

    // Verify project ownership
    const project = await BotProject.findById(projectId);
    if (!project || project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    // Find existing flow or create new one
    let flow = await PromptFlow.findOne({ project: projectId });
    
    if (flow) {
      // Update existing flow and increment version
      Object.assign(flow, {
        version: flow.version + 1,
        nodes,
        edges,
        generatedQuestions: generatedQuestions || flow.generatedQuestions,
        flowConfiguration: flowConfiguration || flow.flowConfiguration
      });
      await flow.save();
    } else {
      // Create new flow with default configuration
      const defaultConfig = {
        startNodeId: nodes.find(n => n.type === 'start')?.id,
        endNodeIds: nodes.filter(n => n.type === 'end').map(n => n.id),
        variables: []
      };

      flow = await PromptFlow.create({
        project: projectId,
        nodes,
        edges,
        generatedQuestions: generatedQuestions || [],
        flowConfiguration: flowConfiguration || defaultConfig
      });
    }

    // Update project status
    await BotProject.findByIdAndUpdate(projectId, {
      status: 'in_progress'
    });

    res.json({
      success: true,
      message: 'Flow saved successfully',
      data: { flow }
    });

  } catch (error) {
    console.error('Save flow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save flow',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get prompt flow
// @route   GET /api/prompts/flow/:projectId
// @access  Private
export const getPromptFlow = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project ownership
    const project = await BotProject.findById(projectId);
    if (!project || project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    // Get latest flow version
    const flow = await PromptFlow.findOne({ project: projectId })
      .sort({ version: -1 })
      .populate('project', 'name description initialPrompt');

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: 'Flow not found for this project'
      });
    }

    res.json({
      success: true,
      data: { flow }
    });

  } catch (error) {
    console.error('Get flow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve flow',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate flow nodes from questions
// @route   POST /api/prompts/generate-flow/:projectId
// @access  Private
export const generateFlowFromQuestions = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { questions, answers = {} } = req.body;

    // Verify project ownership
    const project = await BotProject.findById(projectId);
    if (!project || project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    // Generate flow structure from questions
    const flowStructure = await aiService.generateFlowStructure(
      questions, 
      answers, 
      project.initialPrompt
    );

    res.json({
      success: true,
      message: 'Flow structure generated successfully',
      data: flowStructure
    });

  } catch (error) {
    console.error('Generate flow structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate flow structure',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
