import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    attachmentUrl: {
      type: String,
    },
    urgency: {
      type: String,
      required: [true, "Urgency level is required"],
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    region: {
      type: String,
      trim: true,
    },
    skills_needed: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
