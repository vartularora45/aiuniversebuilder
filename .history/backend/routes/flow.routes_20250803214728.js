import express from "express";
import {
  createFlow,
  getUserFlows,
  getPublicFlow,
  deployFlow,
  runFlow
} from "../controllers/flow.cantroller.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createFlow);
router.get("/my", verifyToken, getUserFlows);
router.get("/:id/public", getPublicFlow);
router.patch("/:id/deploy", verifyToken, deployFlow);
router.post("/:id/run", runFlow);

export default router;
