import express from "express";
const router = express.Router({ mergeParams: true }); //id from URL

import {
  submitSolution,
  getSolutionsForProblem,
  toggleUpvoteSolution,
} from "../controllers/solution.controller.js";

import { isAuthenticated, authorize } from "../middleware/auth.middleware.js";

router.post(
  "/problem/:problemId",
  isAuthenticated,
  authorize("collaborator", "corporate"),
  submitSolution
);

router.get("/problem/:problemId", getSolutionsForProblem);

router.put(
  "/:id/upvote",
  isAuthenticated,
  authorize("collaborator", "corporate"),
  toggleUpvoteSolution
);

export default router;
