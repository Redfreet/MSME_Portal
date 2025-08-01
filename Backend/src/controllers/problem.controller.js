import Problem from "../models/problem.model.js";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";
import Industry from "../models/industry.model.js";
import Solution from "../models/solution.model.js";

export const createProblem = async (req, res) => {
  const { title, description, skills_needed, tags, urgency, region } = req.body;

  if (!title || !description || !urgency) {
    return res
      .status(400)
      .json({ message: "Please provide a title, description and urgency" });
  }

  try {
    const newProblem = new Problem({
      title,
      description,
      skills_needed: skills_needed || [],
      tags: tags || [],
      companyId: req.user.id,
      urgency,
      region: region || "",
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
    const { search, industry, urgency, region } = req.query;
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

    if (urgency) {
      query.urgency = urgency;
    }
    if (region) {
      query.region = { $regex: region, $options: "i" };
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

export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.companyId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this problem" });
    }

    const { title, description, skills_needed, tags, urgency, region } =
      req.body;

    problem.title = title || problem.title;
    problem.description = description || problem.description;
    problem.skills_needed = skills_needed || problem.skills_needed;
    problem.tags = tags || problem.tags;
    problem.urgency = urgency || problem.urgency;
    problem.region = region || problem.region;

    if (req.file) {
      problem.attachmentUrl = req.file.path;
    }

    const updatedProblem = await problem.save();
    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error("Error in updateProblem controller:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllProblemsAdmin = async (req, res) => {
  try {
    const problems = await Problem.find({})
      .populate("companyId", "fullName companyName")
      .sort({ createdAt: -1 });

    res.status(200).json(problems);
  } catch (error) {
    console.error("Error in getAllProblemsAdmin controller:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteProblemAdmin = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    //Delete all solutions associated with this problem
    await Solution.deleteMany({ problemId: req.params.id });

    //Delete all activities associated with this problem
    await Activity.deleteMany({
      entityId: req.params.id,
      entityModel: "Problem",
    });

    //Delete the problem itself
    await problem.deleteOne();

    res.status(200).json({
      message: "Problem and all associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteProblemAdmin controller:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const updateProblemAdmin = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const { title, description, skills_needed, tags, urgency, region, status } =
      req.body;

    if (title) problem.title = title;
    if (description) problem.description = description;
    if (urgency) problem.urgency = urgency;
    if (region) problem.region = region;
    if (status) problem.status = status;

    if (typeof tags === "string") {
      problem.tags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    if (typeof skills_needed === "string") {
      problem.skills_needed = skills_needed
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    if (req.file) {
      problem.attachmentUrl = req.file.path;
    }

    const updatedProblem = await problem.save();
    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error("Error in updateProblemAdmin controller:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const mostActiveProblems = await Solution.aggregate([
      { $group: { _id: "$problemId", commentCount: { $sum: 1 } } },
      { $sort: { commentCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "problems",
          localField: "_id",
          foreignField: "_id",
          as: "problemDetails",
        },
      },
      {
        $unwind: "$problemDetails",
      },
      {
        $project: {
          _id: 1,
          commentCount: 1,
          title: "$problemDetails.title",
        },
      },
    ]);

    const mostPopularSolutions = await Solution.aggregate([
      { $addFields: { upvoteCount: { $size: "$upvotes" } } },
      { $sort: { upvoteCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          content: 1,
          upvoteCount: 1,
          problemId: 1,
        },
      },
    ]);

    const problemsByIndustry = await Problem.aggregate([
      { $match: { status: "Open" } },
      {
        $lookup: {
          from: "users",
          localField: "companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $lookup: {
          from: "industries",
          localField: "company.industry",
          foreignField: "_id",
          as: "industryDetails",
        },
      },
      { $unwind: "$industryDetails" },
      { $group: { _id: "$industryDetails.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      mostActiveProblems,
      mostPopularSolutions,
      problemsByIndustry,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
