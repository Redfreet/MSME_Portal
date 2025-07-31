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
    companyName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      match: [/^[^\s]+$/, "Username cannot contain spaces"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["collaborator", "corporate", "admin"],
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
    industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry" },
    website: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
