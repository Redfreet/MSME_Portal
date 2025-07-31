import express from "express";
import {
  getAllIndustries,
  createIndustry,
  deleteIndustry,
} from "../controllers/industry.controller.js";
import { isAuthenticated, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllIndustries);

// Admin only routes for managing the list of industries
router.post("/", isAuthenticated, authorize("admin"), createIndustry);
router.delete("/:id", isAuthenticated, authorize("admin"), deleteIndustry);

export default router;
