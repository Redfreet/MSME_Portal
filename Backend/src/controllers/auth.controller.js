import { generateToken } from "../utils/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Activity from "../models/activity.model.js";

export const signup = async (req, res) => {
  // console.log("Request body received:", req.body);
  const { fullName, email, password, role, profile, industry, website } =
    req.body;
  try {
    if (!fullName || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long!",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      // profile: {
      //   bio: profile?.bio || "",
      //   skills: profile?.skills || [],
      //   profilePhoto: profile?.profilePhoto || "",
      // },
      industry: role === "corporate" ? industry : undefined,
      website: role === "corporate" ? website : undefined,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = generateToken(user._id);

    res
      .status(200)
      .cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
      })
      .json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internet Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in login controller");
    res.status(500).json({ message: "Internet Server Error" });
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(
      `Fetching activity feed from Activity collection for user: ${userId}`
    );

    const activities = await Activity.find({ userId: userId })
      .sort({ createdAt: -1 }) // most recent first
      .limit(20) // Limit to the last 20 activities
      .lean();
    res.status(200).json(activities);
  } catch (error) {
    console.log("Error in getUserActivity controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
