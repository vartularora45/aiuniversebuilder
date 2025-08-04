import express from "express";
import { registerUser, loginUser,getUserProfile,updateProfile } from "../cantrollers/user.cantroller.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);




export default router;