import express from 'express';
const router = express.Router();
import  {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addMember
} = require('../controllers/workspaceController');
const { auth } = require('../middleware/auth');

// All workspace routes require authentication
router.use(auth);

router.post('/', createWorkspace);
router.get('/', getWorkspaces);
router.get('/:workspaceId', getWorkspaceById);
router.put('/:workspaceId', updateWorkspace);
router.post('/:workspaceId/members', addMember);

module.exports = router;
