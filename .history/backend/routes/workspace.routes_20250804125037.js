import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addMember
} from '../cantrollers/';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/', verifyToken, createWorkspace);
router.get('/', verifyToken, getWorkspaces);
router.get('/:workspaceId', verifyToken, getWorkspaceById);
router.put('/:workspaceId', verifyToken, updateWorkspace);
router.post('/:workspaceId/members', verifyToken, addMember);

export default router;
