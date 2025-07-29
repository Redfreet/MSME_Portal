import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  getMyProblems,
  updateProblemStatus,
} from "../controllers/problem.controller.js";
import { isAuthenticated, authorize } from "../middleware/auth.middleware.js";

import solutionRoutes from "./solution.route.js"; //Solution route is nested to problem i was making mistake here.

const router = express.Router();

router.post("/", isAuthenticated, authorize("corporate"), createProblem);

router.get("/", getAllProblems);

router.get("/my", isAuthenticated, authorize("corporate"), getMyProblems);

router.get("/:id", getProblemById);

// router.use("/:problemId/solutions", solutionRoutes); //if found let solution route handle it
router.put(
  "/:id/status",
  isAuthenticated,
  authorize("corporate"),
  updateProblemStatus
);

export default router;
