import express from "express";
const router = express.Router({ mergeParams: true }); //id from URL

import {
  submitSolution,
  getSolutionsForProblem,
} from "../controllers/solution.controller.js";

import { isAuthenticated, authorize } from "../middleware/auth.middleware.js";

router.post(
  "/",
  isAuthenticated,
  authorize("collaborator", "corporate"),
  submitSolution
);

router.get("/", getSolutionsForProblem);

export default router;
