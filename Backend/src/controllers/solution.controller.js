import Solution from "../models/solution.model.js";
import Problem from "../models/problem.model.js";
import Activity from "../models/activity.model.js";

export const submitSolution = async (req, res) => {
  const { problemId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json({ message: "Solution content cannot be empty." });
  }

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const newSolution = new Solution({
      content,
      problemId,
      collaboratorId: req.user.id,
    });

    const savedSolution = await newSolution.save();

    //new activity document after the solution is saved.
    const activity = new Activity({
      userId: req.user.id,
      type: "SUBMITTED_SOLUTION",
      title: `You submitted a solution for: "${problem.title}"`,
      entityId: problem._id, //to go to prblm link from activity
      entityModel: "Problem",
      focusId: savedSolution._id, //the specific solution to scroll
    });
    await activity.save();

    res.status(201).json(savedSolution);
  } catch (error) {
    console.error("Error submitting solution:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSolutionsForProblem = async (req, res) => {
  const { problemId } = req.params;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found." });
    }

    const solutions = await Solution.find({ problemId })
      .populate("collaboratorId", "fullName email profile.skills")
      .sort({ createdAt: "desc" });

    res.status(200).json(solutions);
  } catch (error) {
    console.error("Error getting solutions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
