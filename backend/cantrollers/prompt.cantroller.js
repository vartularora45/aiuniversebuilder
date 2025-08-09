import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import BotProject from '../db/bot.model.js';
import PromptFlow from '../db/prompt.model.js';
import aiService from '../utils/aiservice.js';
import { buildBotFromPrompt } from '../utils/botbuilderservice.js';
import pdfParse from 'pdf-parse';
import axios from 'axios';
import { Readable } from 'stream';

/**
 * Helper function to verify project ownership
 */
const verifyProjectOwnership = async (projectId, userId) => {
  const project = await BotProject.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  if (project.owner.toString() !== userId) {
    throw new Error('Not authorized to access this project');
  }
  return project;
};

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  return null;
};

// @desc    Generate questions based on prompt
// @route   POST /api/prompts/generate-questions
// @access  Private
export const generateQuestions = async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const { prompt, context = {}, projectId } = req.body;
    console.log(projectId)
    // Verify project ownership if projectId is provided
    if (projectId) {
      try {
        await verifyProjectOwnership(projectId, req.user.id);
      } catch (error) {
        const statusCode = error.message === 'Project not found' ? 404 : 403;
        return res.status(statusCode).json({
          success: false,
          message: error.message
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
  const session = await mongoose.startSession();

  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const { projectId } = req.params;
    const { nodes, edges, generatedQuestions, flowConfiguration } = req.body;

    // Verify project ownership
    let project;
    try {
      project = await verifyProjectOwnership(projectId, req.user.id);
    } catch (error) {
      const statusCode = error.message === 'Project not found' ? 404 : 403;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }

    await session.withTransaction(async () => {
      // Find existing flow or create new one
      let flow = await PromptFlow.findOne({ project: projectId }).session(session);

      if (flow) {
        // Update existing flow and increment version
        Object.assign(flow, {
          version: flow.version + 1,
          nodes,
          edges,
          generatedQuestions: generatedQuestions || flow.generatedQuestions,
          flowConfiguration: flowConfiguration || flow.flowConfiguration
        });
        await flow.save({ session });
      } else {
        // Create new flow with default configuration
        const defaultConfig = {
          startNodeId: nodes.find(n => n.type === 'start')?.id,
          endNodeIds: nodes.filter(n => n.type === 'end').map(n => n.id),
          variables: []
        };

        flow = await PromptFlow.create([{
          project: projectId,
          nodes,
          edges,
          generatedQuestions: generatedQuestions || [],
          flowConfiguration: flowConfiguration || defaultConfig
        }], { session });
      }

      // Update project status
      await BotProject.findByIdAndUpdate(projectId, {
        status: 'in_progress'
      }, { session });

      return flow;
    });

    res.json({
      success: true,
      message: 'Flow saved successfully',
      data: { flow: await PromptFlow.findOne({ project: projectId }) }
    });

  } catch (error) {
    console.error('Save flow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save flow',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await session.endSession();
  }
};

// @desc    Get prompt flow
// @route   GET /api/prompts/flow/:projectId
// @access  Private
export const getPromptFlow = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    try {
      await verifyProjectOwnership(projectId, req.user.id);
    } catch (error) {
      const statusCode = error.message === 'Project not found' ? 404 : 403;
      return res.status(statusCode).json({
        success: false,
        message: error.message
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
    let project;
    try {
      project = await verifyProjectOwnership(projectId, req.user.id);
    } catch (error) {
      const statusCode = error.message === 'Project not found' ? 404 : 403;
      return res.status(statusCode).json({
        success: false,
        message: error.message
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

/**
 * Generate bot code from prompt and questions AND save the bot project right after generation
 * @param {Request} req
 * @param {Response} res
 */

export const generateBotFromPromptAndQuestions = async (req, res) => {
  try {
    const { prompt, questions, trainingText, trainingLink, options = {} } = req.body;
    const trainingFile = req.file;

    console.log('User ID:', req.user?.id);
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized: user id missing' });
    }

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required and must be at least 10 characters long',
      });
    }

    if (questions && !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Questions must be an array if provided',
      });
    }

    let finalTrainingData = '';

    if (trainingText && typeof trainingText === 'string') {
      finalTrainingData += `\n${trainingText.trim()}`;
    }

    if (trainingFile && trainingFile.mimetype === 'application/pdf') {
      try {
        const pdfBuffer = trainingFile.buffer;
        const pdfData = await pdfParse(pdfBuffer);
        finalTrainingData += `\n${pdfData.text}`;
      } catch (err) {
        console.warn('Error parsing PDF:', err);
        return res.status(400).json({
          success: false,
          message: 'Failed to parse uploaded PDF file',
        });
      }
    }

    if (trainingLink && typeof trainingLink === 'string') {
      try {
        const { data } = await axios.get(trainingLink, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        finalTrainingData += `\n${data}`;
      } catch (err) {
        console.warn('Error fetching training link:', err);
        return res.status(400).json({
          success: false,
          message: 'Failed to fetch training data from the provided link',
        });
      }
    }

    const buildOptions = {
      questionCount: questions?.length || 5,
      features: options.features || {},
      uiConfig: options.uiConfig || {},
      projectConfig: options.projectConfig || {},
      trainingData: finalTrainingData.trim()
    };

    const result = await buildBotFromPrompt(prompt.trim(), buildOptions);

    console.log('buildBotFromPrompt result data:', JSON.stringify(result.data, null, 2));

    if (!result.success) {
      console.error('Bot generation failed:', result.error);
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to generate bot',
      });
    }

    const formatFileStructure = (data) => {
      const structure = {
        frontend: {
          files: {},
          dependencies: data.packageFiles?.frontend || {}
        },
        backend: {
          files: {},
          dependencies: data.packageFiles?.backend || {}
        },
        config: {
          files: {}
        },
        questions: data.questions || [],
        metadata: data.metadata || {},
        trainingDataUsed: !!finalTrainingData.trim()
      };

      if (data.frontendCode) {
        if (typeof data.frontendCode === 'string') {
          structure.frontend.files['App.jsx'] = data.frontendCode;
        } else if (typeof data.frontendCode === 'object') {
          Object.keys(data.frontendCode).forEach(fileName => {
            structure.frontend.files[fileName] = data.frontendCode[fileName];
          });
        }
      }

      if (data.backendCode) {
        if (typeof data.backendCode === 'string') {
          structure.backend.files['server.js'] = data.backendCode;
        } else if (typeof data.backendCode === 'object') {
          Object.keys(data.backendCode).forEach(fileName => {
            structure.backend.files[fileName] = data.backendCode[fileName];
          });
        }
      }

      if (data.configFiles) {
        Object.keys(data.configFiles).forEach(fileName => {
          structure.config.files[fileName] = data.configFiles[fileName];
        });
      }

      return structure;
    };

    const formattedResponse = formatFileStructure(result.data);

    // ==== SAVE GENERATED BOT TO DB ====
    console.log(req.user.id)
    const newProject = new BotProject({
      owner: req.user.id,
      name: options.projectName || `Bot Project - ${new Date().toISOString()}`,
      description: prompt.substring(0, 100),
      initialPrompt: prompt.trim(),
      questions: formattedResponse.questions,
      files: {
        frontend: formattedResponse.frontend.files,
        backend: formattedResponse.backend.files,
        config: formattedResponse.config.files
      },
      metadata: formattedResponse.metadata,
      trainingDataUsed: formattedResponse.trainingDataUsed,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    try {
      await newProject.save();
      console.log('New bot project saved with ID:', newProject._id);
    } catch (saveError) {
      console.error('Error saving new project:', saveError);
      return res.status(500).json({ success: false, message: 'Failed to save bot project' });
    }

    const responsePayload = {
      success: true,
      data: {
        projectId: newProject._id,
        botFiles: formattedResponse,
      },
      summary: {
        totalFiles: Object.keys(formattedResponse.frontend.files).length +
          Object.keys(formattedResponse.backend.files).length +
          Object.keys(formattedResponse.config.files).length,
        frontendFiles: Object.keys(formattedResponse.frontend.files),
        backendFiles: Object.keys(formattedResponse.backend.files),
        configFiles: Object.keys(formattedResponse.config.files),
        questionsCount: formattedResponse.questions.length,
        trainingDataLength: finalTrainingData.length
      }
    };

    console.log('Response payload:', JSON.stringify(responsePayload, null, 2));

    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error('Bot generation error:', error);
    const isDev = process.env.NODE_ENV === 'development';

    return res.status(500).json({
      success: false,
      message: 'Failed to generate bot',
      error: isDev ? error.message : undefined,
    });
  }
};


export const generateBotQuestions = async (req, res) => {
  try {
    const { prompt, count = 5 } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required and must be at least 10 characters long',
      });
    }

    const { generateQuestions } = await import('../services/builderservice.js');
    const result = await generateQuestions(prompt.trim(), count);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Question generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate questions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const validateTrainingData = async (req, res) => {
  try {
    const { trainingText, trainingLink } = req.body;
    const trainingFile = req.file;

    const validation = {
      text: null,
      link: null,
      file: null,
      totalLength: 0
    };

    if (trainingText) {
      validation.text = {
        valid: typeof trainingText === 'string' && trainingText.trim().length > 0,
        length: trainingText.length,
        wordCount: trainingText.split(/\s+/).length
      };
      validation.totalLength += trainingText.length;
    }

    if (trainingLink) {
      try {
        const { data } = await axios.head(trainingLink, { timeout: 5000 });
        validation.link = {
          valid: true,
          accessible: true,
          contentType: data.headers?.['content-type']
        };
      } catch (err) {
        validation.link = {
          valid: false,
          accessible: false,
          error: err.message
        };
      }
    }

    if (trainingFile) {
      validation.file = {
        valid: trainingFile.mimetype === 'application/pdf',
        name: trainingFile.originalname,
        size: trainingFile.size,
        type: trainingFile.mimetype
      };

      if (trainingFile.mimetype === 'application/pdf') {
        try {
          const pdfData = await pdfParse(trainingFile.buffer);
          validation.file.textLength = pdfData.text.length;
          validation.file.pageCount = pdfData.numpages;
          validation.totalLength += pdfData.text.length;
        } catch (err) {
          validation.file.valid = false;
          validation.file.error = 'Failed to parse PDF';
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: validation
    });

  } catch (error) {
    console.error('Training data validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate training data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const downloadBotFiles = async (req, res) => {
  try {
    const { botData } = req.body;

    if (!botData || !botData.success || !botData.data) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bot data provided',
      });
    }

    const { formatFilesForDownload } = await import('../services/builderservice.js');
    const files = formatFilesForDownload(botData.data);

    const zipBuffer = await createZipFromFiles(files);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="chatbot-project.zip"');
    res.setHeader('Content-Length', zipBuffer.length);

    return res.send(zipBuffer);

  } catch (error) {
    console.error('File download error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create download',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const createZipFromFiles = async (files) => {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  files.forEach(file => {
    zip.file(file.name, file.content);
  });

  return await zip.generateAsync({ type: 'nodebuffer' });
};

export const getBotGenerationStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    const status = await getGenerationStatus(sessionId);

    return res.status(200).json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get generation status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const generationSessions = new Map();

const getGenerationStatus = async (sessionId) => {
  return generationSessions.get(sessionId) || {
    status: 'not_found',
    message: 'Session not found'
  };
};

export const startGenerationSession = (sessionId) => {
  generationSessions.set(sessionId, {
    status: 'started',
    progress: 0,
    message: 'Generation started'
  });
};

export const updateGenerationSession = (sessionId, progress, message) => {
  if (generationSessions.has(sessionId)) {
    generationSessions.set(sessionId, {
      status: progress === 100 ? 'completed' : 'in_progress',
      progress,
      message
    });
  }
};

export const endGenerationSession = (sessionId) => {
  generationSessions.delete(sessionId);
};
export const getAllProjects = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search ? req.query.search.trim() : '';

  try {
    // Build the query
    let query = {
      owner: req.user.id,
      // Optionally filter out deleted projects
      deletedAt: { $exists: false }
    };

    // Add search filter if provided
    if (search) {
      // Case-insensitive search on name and description
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get paginated projects
    const projects = await BotProject.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // Get total count for pagination metadata
    const total = await BotProject.countDocuments(query);

    res.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
