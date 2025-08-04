// Filename: flow.controller.js

import Flow from "../db/flow.model.js";
import fetch from "node-fetch"; // If you're using Node.js < 18, install with: npm i node-fetch
import dotenv from "dotenv";
dotenv.config();

// ✅ Create a new flow
export const createFlow = async (req, res) => {
  try {
    const { title, description, blocks } = req.body;

    if (!title || !blocks) {
      return res.status(400).json({ message: "Title and blocks are required" });
    }

    const userId = req.user.id;

    const newFlow = new Flow({
      title,
      description,
      blocks,
      userId
    });

    await newFlow.save();
    return res.status(201).json({ message: "Flow created successfully", flow: newFlow });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all flows of the current user
export const getUserFlows = async (req, res) => {
  try {
    const flows = await Flow.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    return res.status(200).json({ flows });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching flows", error: err.message });
  }
};

// ✅ Get a public flow by ID
export const getPublicFlow = async (req, res) => {
  try {
    const { id } = req.params;

    const flow = await Flow.findOne({ _id: id, isPublic: true });

    if (!flow) {
      return res.status(404).json({ message: "Public flow not found" });
    }

    return res.status(200).json({ flow });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Deploy a flow (make it public + generate a deployed URL)
export const deployFlow = async (req, res) => {
  try {
    const { id } = req.params;
    const flow = await Flow.findById(id);

    if (!flow) return res.status(404).json({ message: "Flow not found" });
    if (String(flow.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    flow.isPublic = true;
    flow.deployedUrl = `https://aiuniverse.vercel.app/f/tool/${flow._id}`;
    await flow.save();

    return res.status(200).json({
      message: "Flow deployed successfully",
      deployedUrl: flow.deployedUrl
    });

  } catch (err) {
    return res.status(500).json({ message: "Error deploying flow", error: err.message });
  }
};

// ✅ Run a flow with user input (calls OpenAI or other AI model)
export const runFlow = async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;

    const flow = await Flow.findById(id);

    if (!flow || !flow.isPublic) {
      return res.status(404).json({ message: "Flow not found or is private" });
    }

    const gptBlock = flow.blocks.find(b => b.type === "gpt");

    if (!gptBlock) {
      return res.status(400).json({ message: "Flow does not contain a GPT block" });
    }

    // 🧠 Call OpenAI
    const prompt = `${gptBlock.prompt}\n\nUser: ${input}`;

    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: gptBlock.model || "gpt-3.5-turbo",
        messages: [
          { role: "system", content: gptBlock.prompt },
          { role: "user", content: input }
        ]
      })
    });

    const data = await gptResponse.json();

    if (!data.choices) {
      return res.status(500).json({ message: "OpenAI API Error", data });
    }

    const output = data.choices[0].message.content;

    return res.status(200).json({
      input,
      result: output
    });

  } catch (err) {
    return res.status(500).json({ message: "Error running flow", error: err.message });
  }
};
