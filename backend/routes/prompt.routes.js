// routes/promptRoutes.js

import express from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import {
  generateQuestions,
  savePromptFlow,
  getPromptFlow,
  generateFlowFromQuestions,
  getAllProjects,
  generateBotFromPromptAndQuestions
} from '../cantrollers/prompt.cantroller.js';
import { protect } from '../middleware/auth.js';
import previewService from '../utils/previewService.js';

const router = express.Router();

// Setup Multer (memory storage for PDF)
const upload = multer({ storage: multer.memoryStorage() });

// Validation rules
const generateQuestionsValidation = [
  body('prompt').isLength({ min: 10, max: 1000 }).trim(),
  body('context').optional().isObject(),
  body('projectId').optional().isMongoId()
];
const saveFlowValidation = [
  body('nodes').isArray({ min: 1 }),
  body('edges').isArray(),
  body('nodes.*.id').notEmpty(),
  body('nodes.*.type').isIn(['start', 'question', 'condition', 'action', 'end'])
];

// Apply protection to all routes
router.use(protect);

// Routes
router.post(
  '/generate-bot',
  upload.single('trainingFile'), // 👈 Add multer middleware here
  generateQuestionsValidation,
  generateBotFromPromptAndQuestions
);
router.get('/projects', getAllProjects)
router.post('/generate-questions', generateQuestionsValidation, generateQuestions);
router.post('/save-flow/:projectId', savePromptFlow);
router.get('/flow/:projectId', getPromptFlow);
router.post('/generate-flow/:projectId', generateFlowFromQuestions);

// ⭐ NEW - Preview and testing routes
router.post('/start-preview', async (req, res) => {
  try {
    const { frontendCode, backendCode, projectId } = req.body;
    
    if (!frontendCode && !backendCode) {
      return res.status(400).json({
        success: false,
        message: 'At least frontend or backend code is required'
      });
    }

    const result = {};

    // Start frontend preview if code provided
    if (frontendCode) {
      try {
        const previewResult = await previewService.generateReactPreview(frontendCode, projectId || 'temp');
        const serverResult = await previewService.startReactServer(previewResult.projectDir, previewResult.port);
        result.frontend = {
          serverId: serverResult.serverId,
          port: serverResult.port,
          url: `http://localhost:${serverResult.port}`
        };
      } catch (error) {
        console.error('Frontend preview error:', error);
        result.frontend = { error: error.message };
      }
    }

    // Start backend preview if code provided
    if (backendCode) {
      try {
        const previewResult = await previewService.generateBackendPreview(backendCode, projectId || 'temp');
        const serverResult = await previewService.startNodeServer(previewResult.projectDir, previewResult.port);
        result.backend = {
          serverId: serverResult.serverId,
          port: serverResult.port,
          url: `http://localhost:${serverResult.port}`
        };
      } catch (error) {
        console.error('Backend preview error:', error);
        result.backend = { error: error.message };
      }
    }

    res.json({
      success: true,
      message: 'Preview servers started',
      data: result
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start preview',
      error: error.message
    });
  }
});

router.post('/test-backend', async (req, res) => {
  try {
    const { serverId, endpoint, method = 'GET', requestData } = req.body;
    
    if (!serverId || !endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Server ID and endpoint are required'
      });
    }

    const result = await previewService.testEndpoint(serverId, endpoint, method, requestData);
    
    res.json({
      success: true,
      message: 'Backend test completed',
      data: result
    });
  } catch (error) {
    console.error('Backend test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test backend',
      error: error.message
    });
  }
});

router.post('/stop-preview', async (req, res) => {
  try {
    const { serverId } = req.body;
    
    if (!serverId) {
      return res.status(400).json({
        success: false,
        message: 'Server ID is required'
      });
    }

    const stopped = await previewService.stopServer(serverId);
    
    res.json({
      success: true,
      message: stopped ? 'Server stopped' : 'Server not found',
      data: { stopped }
    });
  } catch (error) {
    console.error('Stop preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to stop preview',
      error: error.message
    });
  }
});

export default router;
