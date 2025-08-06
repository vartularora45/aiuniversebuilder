import jwt from 'jsonwebtoken';
import User from '../db/user.model.js';

/**
 * Protect routes — verify JWT token and attach user to `req`
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Bearer token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Fallback to cookie token if not in header
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3. Fallback to body token
    if (!token && req.body?.token) {
      token = req.body.token;
    }

    console.log('Token:', token); // Debug log

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route (no token)'
      });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded token:', decoded); // Debug log
    const user = await User.findById(decoded.id); // ⬅️ make sure your payload uses userId

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found for provided token'
      });
    }

    req.user = user; // ✅ attach user to request
    next(); // ✅ proceed
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token'
    });
  }
};
