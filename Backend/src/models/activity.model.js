import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, //for faster queries on this field
    },
    type: {
      type: String,
      required: true,
      enum: [
        "POSTED_PROBLEM",
        "SUBMITTED_SOLUTION",
        "UPVOTED_SOLUTION",
        "ACCEPTED_SOLUTION",
      ],
    },
    title: {
      type: String,
      required: true,
    },
    // The ID of the document related to this activity, Problem ID or Solution ID
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // The name of the model that entityId refers to, for flexible population
    entityModel: {
      type: String,
      required: true,
      enum: ["Problem", "Solution"],
    },
    focusId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
