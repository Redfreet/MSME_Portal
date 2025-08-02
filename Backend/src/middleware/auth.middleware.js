import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // console.log("--- New Authenticated Request ---");
    // console.log("Request Origin:", req.headers.origin);
    // console.log("Cookies Received by Server:", req.cookies);
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.userId)
      .select("-password")
      .populate("industry", "name");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found.", success: false });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden. Access denied for role: '${req.user.role}'.`,
        success: false,
      });
    }
    next();
  };
};
