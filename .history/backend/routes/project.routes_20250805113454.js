import express from "express";
import { body } from "express-validator";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enhanced validation rules with better error messages
const createProjectValidation = [
  body("name")
    .isLength({ min: 1, max: 100 })
    .trim()
    .escape()
    .withMessage("Project name must be between 1 and 100 characters"),

  body("initialPrompt")
    .isLength({ min: 10, max: 1000 })
    .trim()
    .withMessage("Initial prompt must be between 10 and 1000 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .trim()
    .escape()
    .withMessage("Description must not exceed 500 characters"),

  body("category")
    .optional()
    .isIn([
      "education",
      "ecommerce",
      "healthcare",
      "finance",
      "support",
      "other",
    ])
    .withMessage(
      "Category must be one of: education, ecommerce, healthcare, finance, support, other"
    ),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim()
    .escape()
    .withMessage("Each tag must be between 1 and 50 characters"),
];

// Update project validation rules
const updateProjectValidation = [
  body("name")
    .optional()
    .isLength({ min: 1, max: 100 })
    .trim()
    .escape()
    .withMessage("Project name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .trim()
    .escape()
    .withMessage("Description must not exceed 500 characters"),

  body("category")
    .optional()
    .isIn([
      "education",
      "ecommerce",
      "healthcare",
      "finance",
      "support",
      "other",
    ])
    .withMessage(
      "Category must be one of: education, ecommerce, healthcare, finance, support, other"
    ),

  body("status")
    .optional()
    .isIn(["draft", "in_progress", "completed", "archived"])
    .withMessage(
      "Status must be one of: draft, in_progress, completed, archived"
    ),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim()
    .escape()
    .withMessage("Each tag must be between 1 and 50 characters"),
];

// Apply protection to all routes
router.use(protect);

// Main project routes
router.route("/").get(getProjects).post(createProjectValidation, createProject);

// Individual project routes
router
  .route("/:id")
  .get(getProject)
  .put(updateProjectValidation, updateProject)
  .delete(deleteProject);

export default router;
