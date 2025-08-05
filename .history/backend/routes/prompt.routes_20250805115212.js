// routes/promptRoutes.js

import express from 'express';
import { body } from 'express-validator';
import {
  generateQuestions,
  savePromptFlow,
  getPromptFlow,
  generateFlowFromQuestions
} from '../controllers/promptController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

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
router.post('/generate-questions', generateQuestionsValidation, generateQuestions);
router.post('/save-flow/:projectId', saveFlowValidation, savePromptFlow);
router.get('/flow/:projectId', getPromptFlow);
router.post('/generate-flow/:projectId', generateFlowFromQuestions);

export default router;
