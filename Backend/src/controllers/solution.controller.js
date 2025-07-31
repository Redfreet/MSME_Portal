import Solution from "../models/solution.model.js";
import Problem from "../models/problem.model.js";
import Activity from "../models/activity.model.js";

export const submitSolution = async (req, res) => {
  const { problemId } = req.params;
  const { content, parentSolution } = req.body;

  console.log("Submitting solution. Request body:", req.body);

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

    if (parentSolution) {
      const parent = await Solution.findById(parentSolution);
      if (!parent) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    const newSolution = new Solution({
      content,
      problemId,
      collaboratorId: req.user.id,
      parentSolution: parentSolution || null,
    });

    let savedSolution = await newSolution.save();

    const activity = new Activity({
      userId: req.user.id,
      type: "SUBMITTED_SOLUTION",
      title: `You submitted a solution for: "${problem.title}"`,
      entityId: problem._id,
      entityModel: "Problem",
      focusId: savedSolution._id,
    });

    await activity.save();

    savedSolution = await savedSolution.populate(
      "collaboratorId",
      "fullName username"
    );
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

    const allSolutions = await Solution.find({ problemId })
      .populate("collaboratorId", "fullName username")
      .sort({ createdAt: "asc" });

    const solutionMap = {};
    const rootSolutions = [];

    allSolutions.forEach((solution) => {
      solution = solution.toObject();
      solution.replies = [];
      solutionMap[solution._id] = solution;
    });

    //link replies to their parents
    allSolutions.forEach((solution) => {
      if (solution.parentSolution) {
        const parent = solutionMap[solution.parentSolution];
        if (parent) {
          parent.replies.push(solutionMap[solution._id]);
        }
      } else {
        rootSolutions.push(solutionMap[solution._id]);
      }
    });
    const sortedRootSolutions = rootSolutions.reverse();
    res.status(200).json(sortedRootSolutions);
  } catch (error) {
    console.error("Error getting solutions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const toggleUpvoteSolution = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    const userId = req.user._id;

    const upvoteIndex = solution.upvotes.indexOf(userId);

    if (upvoteIndex === -1) {
      solution.upvotes.push(userId);
    } else {
      solution.upvotes.splice(upvoteIndex, 1);
    }

    await solution.save();

    const populatedSolution = await solution.populate(
      "collaboratorId",
      "fullName username"
    );

    res.status(200).json(populatedSolution);
  } catch (error) {
    console.error("Error in toggleUpvoteSolution controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSolution = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    if (
      solution.collaboratorId.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this solution" });
    }

    const deleteReplies = async (solutionId) => {
      const replies = await Solution.find({ parentSolution: solutionId });
      for (const reply of replies) {
        await deleteReplies(reply._id);
      }
      await Solution.findByIdAndDelete(solutionId);
      await Activity.deleteMany({ focusId: solutionId });
    };

    await deleteReplies(req.params.id);

    res
      .status(200)
      .json({ message: "Solution and all replies deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSolution controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
