import express from "express";
import { registerUser, loginUser,getUserProfile,updateProfile } from "../cantrollers/user.cantroller.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile);
router.put("/profile", updateProfile);



export default router;