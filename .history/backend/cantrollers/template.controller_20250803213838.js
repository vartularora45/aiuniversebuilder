import Template from "../models/template.model.js";

export const createTemplate = async (req, res) => {
  try {
    const { title, description, blocks, tags } = req.body;

    const template = await Template.create({
      title,
      description,
      blocks,
      tags,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Template saved", template });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json({ templates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
