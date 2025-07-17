import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      // person or Company
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["collaborator", "corporate"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      profilePhoto: {
        type: String,
        default: "",
      },
    },
    industry: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
