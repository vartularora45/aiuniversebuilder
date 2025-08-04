import express from 'express';
import { createWorkspace, getWorkspaces, getWorkspaceById, updateWorkspace, addMember} from  '../'
const router = express.Router();


// All workspace routes require authentication
router.use(auth);

router.post('/', createWorkspace);
router.get('/', getWorkspaces);
router.get('/:workspaceId', getWorkspaceById);
router.put('/:workspaceId', updateWorkspace);
router.post('/:workspaceId/members', addMember);

module.exports = router;
