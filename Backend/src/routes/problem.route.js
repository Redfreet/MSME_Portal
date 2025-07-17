import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  getMyProblems,
} from "../controllers/problem.controller.js";
import { isAuthenticated, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, authorize("corporate"), createProblem);

router.get("/", getAllProblems);

router.get("/my", isAuthenticated, authorize("corporate"), getMyProblems);

router.get("/:id", getProblemById);

export default router;
