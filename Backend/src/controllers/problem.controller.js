import Problem from "../models/problem.model.js";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";
import Industry from "../models/industry.model.js";

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

    if (req.file) {
      newProblem.attachmentUrl = req.file.path;
    }

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
    const { search, industry } = req.query;
    const query = {};

    if (industry) {
      const industryDoc = await Industry.findOne({
        name: { $regex: `^${industry}$`, $options: "i" },
      });

      if (industryDoc) {
        const corporateUsers = await User.find({
          role: "corporate",
          industry: industryDoc._id,
        }).select("_id");
        const userIds = corporateUsers.map((user) => user._id);
        query.companyId = { $in: userIds };
      } else {
        query.companyId = { $in: [] };
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const allProblems = await Problem.find(query)
      .populate("companyId", "fullName industry companyName")
      .sort({ createdAt: -1 });

    const openProblems = allProblems.filter(
      (p) => p.status === "Open" || p.status === "In Progress"
    );
    const closedProblems = allProblems.filter(
      (p) => p.status === "Closed" || p.status === "Solved"
    );

    res.status(200).json({ openProblems, closedProblems });
  } catch (error) {
    console.error("Error in getAllProblems controller:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate(
      "companyId",
      "fullName industry website companyName"
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
    const problems = await Problem.find({ companyId: req.user.id })
      .populate("companyId", "fullName industry companyName")
      .sort({
        createdAt: -1,
      });
    res.json(problems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

export const updateProblemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Authorization check user who created the problem can change its status.
    if (problem.companyId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this problem" });
    }

    // Validate the new status to ensure it's one of the allowed values
    const allowedStatuses = ["Open", "Closed"];
    if (!status || !allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing status value" });
    }

    problem.status = status;
    await problem.save();

    res.status(200).json(problem);
  } catch (error) {
    console.error("Error updating problem status:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await Problem.distinct("tags");
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
