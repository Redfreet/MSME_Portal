import { generateToken } from "../utils/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Activity from "../models/activity.model.js";
import Industry from "../models/industry.model.js";

export const signup = async (req, res) => {
  // console.log("Request body received:", req.body);
  const {
    fullName,
    email,
    password,
    role,
    profile,
    industry,
    website,
    username,
  } = req.body;
  try {
    if (!fullName || !username || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }

    if (/\s/.test(username)) {
      return res.status(400).json({
        message: "Username cannot contain spaces.",
        success: false,
      });
    }

    if (role === "corporate" && !industry) {
      return res.status(400).json({
        message: "Industry is required for corporate accounts.",
        success: false,
      });
    }

    if (role === "corporate") {
      const industryExists = await Industry.findById(industry);
      if (!industryExists) {
        return res
          .status(400)
          .json({ message: "Invalid industry selected.", success: false });
      }
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long!",
        success: false,
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message: "An account with this email already exists.",
          success: false,
        });
      }
      if (existingUser.username === username) {
        return res
          .status(400)
          .json({ message: "This username is already taken.", success: false });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
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
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        industry: newUser.industry,
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
        username: user.username,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        industry: user.industry,
        website: user.website,
        profile: user.profile,
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

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;

      if (user.role === "collaborator") {
        user.profile.bio = req.body.bio || user.profile.bio;
      }

      if (user.role === "corporate") {
        user.industry = req.body.industry || user.industry;
        user.website = req.body.website || user.website;
        user.companyName = req.body.companyName;
      }

      const updatedUser = await user.save();
      await updatedUser.populate("industry", "name");

      res.status(200).json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        companyName: updatedUser.companyName,
        profile: updatedUser.profile,
        industry: updatedUser.industry,
        website: updatedUser.website,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in updateUserProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const profilePhotoUrl = req.file.path;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.profile.profilePhoto = profilePhotoUrl;
    await user.save();

    await user.populate("industry", "name");

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateProfilePicture controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
