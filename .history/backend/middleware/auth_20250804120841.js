const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided or invalid format.' 
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid or user is inactive.' 
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired.' 
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid.' 
    });
  }
};

// Workspace membership middleware
const checkWorkspaceMembership = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const Workspace = require('../models/Workspace');
    
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.userId': req.user._id,
      isActive: true
    });

    if (!workspace) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not a member of this workspace.'
      });
    }

    req.workspace = workspace;
    req.userRole = workspace.members.find(m => m.userId.toString() === req.user._id.toString()).role;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking workspace membership',
      error: error.message
    });
  }
};

module.exports = { auth, checkWorkspaceMembership };
