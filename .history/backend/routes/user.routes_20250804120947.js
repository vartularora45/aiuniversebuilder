import express from "express";
import { registerUser, loginUser,get } from "../cantrollers/user.cantroller.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);



export default router;