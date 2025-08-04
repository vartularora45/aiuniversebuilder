import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies.accesstoken || // correct cookie name
      req.headers.authorization?.split(" ")[1];

    console.log("Token:", token);
    
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (err) {
    console.error("Token Error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
