import Solution from "../models/solution.model.js";
import Problem from "../models/problem.model.js";

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
