import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";
const upload = multer({ storage });

import {
  createProblem,
  getAllProblems,
  getProblemById,
  getMyProblems,
  updateProblemStatus,
  getAllTags,
  updateProblem,
  getAllProblemsAdmin,
} from "../controllers/problem.controller.js";
import { isAuthenticated, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  authorize("corporate"),
  upload.single("attachment"),
  createProblem
);

router.get("/", getAllProblems);

router.get("/my", isAuthenticated, authorize("corporate"), getMyProblems);

//before '/:id' to be matched correctly
router.get("/tags", getAllTags);

router.get("/:id", getProblemById);

// router.use("/:problemId/solutions", solutionRoutes); //if found let solution route handle it
router.put(
  "/:id/status",
  isAuthenticated,
  authorize("corporate"),
  updateProblemStatus
);

router.put(
  "/:id",
  isAuthenticated,
  authorize("corporate"),
  upload.single("attachment"),
  updateProblem
);

router.get(
  "/admin/all",
  isAuthenticated,
  authorize("admin"),
  getAllProblemsAdmin
);

router.delete(
  "/admin/:id",
  isAuthenticated,
  authorize("admin"),
  deleteProblemAdmin
);

export default router;
