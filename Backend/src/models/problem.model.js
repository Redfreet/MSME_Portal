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
    },
    description: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["collaborator", "corporate"],
      required: true,
    },
    skills_needed: [{ type: String }],
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
