import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addMember,
  getWorkspaceByUserId,
  removeMember,
  updateMemberRole,
  getWorkspaceActivity
} from '../cantrollers/workspace.cantroller.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Workspace management routes
router.post('/', verifyToken, createWorkspace);
router.get('/', verifyToken, getWorkspaces);
router.get('/:workspaceId', verifyToken, getWorkspaceById);
router.get('/user/:userId', verifyToken, getWorkspaceByUserId);
router.put('/:workspaceId', verifyToken, checkRole(['owner', 'admin']), updateWorkspace);
router.delete('/:workspaceId', verifyToken, checkRole(['owner']), async (req, res) => {
  try {
    const workspace = await Workspace.findOneAndUpdate(
      { _id: req.params.workspaceId, 'members.userId': req.user._id, 'members.role': 'owner' },
      { isActive: false },
      { new: true }
    );
    
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found or insufficient permissions'
      });
    }

    res.json({
      success: true,
      message: 'Workspace archived successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error archiving workspace',
      error: error.message
    });
  }
});

// Member management routes
router.post('/:workspaceId/members', verifyToken, checkRole(['owner', 'admin']), addMember);
router.delete('/:workspaceId/members/:memberId', verifyToken, checkRole(['owner', 'admin']), removeMember);
router.put('/:workspaceId/members/:memberId/role', verifyToken, checkRole(['owner']), updateMemberRole);

// Activity and statistics routes
router.get('/:workspaceId/activity', verifyToken, getWorkspaceActivity);

// Search route
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;
    
    const searchQuery = {
      'members.userId': req.user._id,
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    if (type !== 'all') {
      searchQuery.visibility = type;
    }

    const workspaces = await Workspace.find(searchQuery)
      .populate('members.userId', 'name email avatar')
      .select('name description visibility members stats lastActive')
      .sort({ lastActive: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { workspaces }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching workspaces',
      error: error.message
    });
  }
});

export default router;
