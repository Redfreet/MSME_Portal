import express from "express";
const router = express.Router({ mergeParams: true }); //id from URL

import {
  submitSolution,
  getSolutionsForProblem,
  toggleUpvoteSolution,
  deleteSolution,
} from "../controllers/solution.controller.js";

import { isAuthenticated, authorize } from "../middleware/auth.middleware.js";

router.post(
  "/problem/:problemId",
  isAuthenticated,
  authorize("collaborator", "corporate", "admin"),
  submitSolution
);

router.get("/problem/:problemId", getSolutionsForProblem);

router.put(
  "/:id/upvote",
  isAuthenticated,
  authorize("collaborator", "corporate", "admin"),
  toggleUpvoteSolution
);

router.delete(
  "/:id",
  isAuthenticated,
  authorize("collaborator", "corporate", "admin"),
  deleteSolution
);

export default router;
