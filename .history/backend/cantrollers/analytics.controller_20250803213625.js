import Analytics from "..//analytics.model.js";

export const logAnalytics = async (req, res) => {
  try {
    const { flowId, input, output } = req.body;
    const ip = req.ip;
    const userAgent = req.get("User-Agent");

    const entry = await Analytics.create({
      flowId,
      input,
      output,
      ipAddress: ip,
      userAgent
    });

    res.status(201).json({ message: "Analytics logged", entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { flowId } = req.params;
    const logs = await Analytics.find({ flowId }).sort({ usedAt: -1 });
    res.status(200).json({ logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
