import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    collaboratorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Solution content is required"],
    },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Accepted", "Rejected"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
