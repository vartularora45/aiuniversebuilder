import Flow from "../db/flow.model";

// ✅ Create new flow
export const createFlow = async (req, res) => {
  try {
    const { title, description, blocks } = req.body;
    const userId = req.user.id; // Make sure JWT middleware sets this

    const newFlow = new Flow({
      title,
      description,
      blocks,
      userId
    });

    await newFlow.save();

    res.status(201).json({
      message: "Flow created successfully",
      flow: newFlow
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all flows of logged-in user
export const getUserFlows = async (req, res) => {
  try {
    const flows = await Flow.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json({ flows });
  } catch (err) {
    res.status(500).json({ message: "Error fetching flows", error: err.message });
  }
};

// ✅ Get a public flow by ID
export const getPublicFlow = async (req, res) => {
  try {
    const { id } = req.params;

    const flow = await Flow.findById(id);

    if (!flow || !flow.isPublic) {
      return res.status(404).json({ message: "Public flow not found" });
    }

    res.status(200).json({ flow });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Deploy a flow (make it public + generate URL)
export const deployFlow = async (req, res) => {
  try {
    const { id } = req.params;

    const flow = await Flow.findById(id);

    if (!flow) return res.status(404).json({ message: "Flow not found" });

    if (String(flow.userId) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    flow.isPublic = true;
    flow.deployedUrl = `https://aiuniverse.vercel.app/f/tool/${flow._id}`;
    await flow.save();

    res.status(200).json({
      message: "Flow deployed successfully",
      deployedUrl: flow.deployedUrl
    });

  } catch (err) {
    res.status(500).json({ message: "Error deploying flow", error: err.message });
  }
};

// ✅ Run a flow with input
export const runFlow = async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;

    const flow = await Flow.findById(id);

    if (!flow || !flow.isPublic) {
      return res.status(404).json({ message: "Flow not found or private" });
    }

    // ⚙️ Execute flow logic
    let response = "";
    const inputBlock = flow.blocks.find(b => b.type === "input");
    const gptBlock = flow.blocks.find(b => b.type === "gpt");

    if (gptBlock) {
      const prompt = `${gptBlock.prompt}\n\nUser: ${input}`;

      // Use your own OpenAI call here 👇
      const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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

      const data = await gptRes.json();
      response = data.choices?.[0]?.message?.content || "Error";
    }

    res.status(200).json({
      input,
      result: response
    });

  } catch (err) {
    res.status(500).json({ message: "Error running flow", error: err.message });
  }
};
