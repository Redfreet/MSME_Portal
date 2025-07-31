import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Industry name is required"],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Industry = mongoose.model("Industry", industrySchema);

export default Industry;
