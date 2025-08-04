import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    // Token nikalne ke 3 jagah se attempt karo
    const token =
      req.cookies?.token ||
      req.headers?.authorization?.split(" ")[1] ||
      req.body?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Decoded data ko req.user me chipkao for downstream access
    req.user = decoded;

    // Next middleware/controller ko call karo
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
