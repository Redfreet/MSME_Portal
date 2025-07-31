import Industry from "../models/industry.model.js";

export const getAllIndustries = async (req, res) => {
  try {
    const industries = await Industry.find().sort({ name: 1 });
    res.status(200).json(industries);
  } catch (error) {
    console.error("Error fetching industries:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createIndustry = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Industry name is required" });
  }
  try {
    // Check if industry already exists (case-insensitive)
    const industryExists = await Industry.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (industryExists) {
      return res.status(400).json({ message: "Industry already exists" });
    }
    const industry = new Industry({ name });
    await industry.save();
    res.status(201).json(industry);
  } catch (error) {
    console.error("Error creating industry:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteIndustry = async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }
    await industry.deleteOne();
    res.status(200).json({ message: "Industry removed" });
  } catch (error) {
    console.error("Error deleting industry:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
