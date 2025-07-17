import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    solution_text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Problem = mongoose.model("Problem", problemSchema);
