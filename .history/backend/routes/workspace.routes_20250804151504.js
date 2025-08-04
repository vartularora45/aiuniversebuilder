import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addMember,
  getWorkspaceByUserId
} from '../cantrollers/workspace.cantroller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/', verifyToken, createWorkspace);
router.get('/', verifyToken, getWorkspaces);
router.get('/:workspaceId', verifyToken, getWorkspaceById);
router.get('/user/:userId', verifyToken, getWorkspaceByUserId);
router.put('/:workspaceId', verifyToken, updateWorkspace);
router.post('/:workspaceId/members', verifyToken, addMember);

export default router;
