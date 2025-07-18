import Problem from "../models/problem.model.js";
import Activity from "../models/activity.model.js";

export const createProblem = async (req, res) => {
  const { title, description, skills_needed, tags } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Please provide a title and description" });
  }

  try {
    const newProblem = new Problem({
      title,
      description,
      skills_needed: skills_needed || [],
      tags: tags || [],
      companyId: req.user.id,
    });

    const problem = await newProblem.save();

    // Create a new activity document after the problem is successfully saved.
    const activity = new Activity({
      userId: req.user.id,
      type: "POSTED_PROBLEM",
      title: `You posted the problem: "${problem.title}"`,
      entityId: problem._id,
      entityModel: "Problem",
    });

    await activity.save();
    res.status(201).json(problem);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .populate("companyId", "fullName industry")
      .sort({ createdAt: -1 });

    res.json(problems);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate(
      "companyId",
      "fullName industry website"
    );

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Problem not found" });
    }
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getMyProblems = async (req, res) => {
  try {
    const problems = await Problem.find({ companyId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(problems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};
