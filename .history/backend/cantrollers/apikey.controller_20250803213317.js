import APIKey from "..//apikey.model.js";

export const saveApiKeys = async (req, res) => {
  try {
    const { openaiKey, huggingfaceKey, geminiKey } = req.body;
    const userId = req.user.id;

    const existing = await APIKey.findOneAndUpdate(
      { userId },
      { openaiKey, huggingfaceKey, geminiKey },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Keys saved", keys: existing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApiKeys = async (req, res) => {
  try {
    const userId = req.user.id;
    const keys = await APIKey.findOne({ userId });
    res.status(200).json({ keys });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
