import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

router.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
