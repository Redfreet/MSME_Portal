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

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
