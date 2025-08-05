import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  getWorkspaceByUserId,
  updateWorkspace,
  addMember,
  removeMember,
  updateMemberRole,
  getWorkspaceActivity
} from '../cantrollers/workspace.cantroller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Workspace management routes
router.post('/', verifyToken, createWorkspace);
router.get('/', verifyToken, getWorkspaces);gr
router.get('/:workspaceId', verifyToken, getWorkspaceById);
router.get('/user/:userId', verifyToken, getWorkspaceByUserId);
router.put('/:workspaceId', verifyToken, updateWorkspace);

// Member management routes
router.post('/:workspaceId/members', verifyToken, addMember);
router.delete('/:workspaceId/members/:memberId', verifyToken, removeMember);
router.put('/:workspaceId/members/:memberId/role', verifyToken, updateMemberRole);

// Activity routes
router.get('/:workspaceId/activity', verifyToken, getWorkspaceActivity);

export default router;
