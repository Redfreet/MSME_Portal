import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";
const upload = multer({ storage });

import {
  login,
  logout,
  signup,
  getUserActivity,
  updateUserProfile,
  updateProfilePicture,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use((req, res, next) => {
  // console.log(
  //   `[USER ROUTER] Received request: ${req.method} ${req.originalUrl}`
  // );
  next();
});

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

router.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/activity", isAuthenticated, getUserActivity);

router.put("/profile", isAuthenticated, updateUserProfile);
export default router;

router.put(
  "/profile/picture",
  (req, res, next) => {
    // console.log(
    //   "[PROFILE PICTURE ROUTE] Reached the picture upload route. Attempting to process file..."
    // );
    next();
  },
  isAuthenticated,
  upload.single("profilePhoto"),
  updateProfilePicture
);
