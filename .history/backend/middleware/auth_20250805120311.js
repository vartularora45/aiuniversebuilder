import jwt from 'jsonwebtoken';
import User from '../db/user.model.js';

/**
 * Protect routes — verify JWT token and attach user to `req`
 */
export const protect = async (req, res, next) => {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token and fetch user
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    req.user = user;          // attach user to request
    next();                   // proceed to next middleware
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Grant access to specific roles
 * @param  {...string} roles Allowed roles
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `User role ${req.user.role} is not authorized to access this route`
    });
  }
  next();
};

// Default export for backward compatibility
export default {
  protect,
  authorize
};
