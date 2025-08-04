import Feedback from "../db/feedback.model";

export const giveFeedback = async (req, res) => {
  try {
    const { flowId, rating, comment } = req.body;
    const userId = req.user.id;

    const fb = await Feedback.create({
      flowId, userId, rating, comment
    });

    res.status(201).json({ message: "Thanks for your feedback", feedback: fb });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const { flowId } = req.params;
    const data = await Feedback.find({ flowId });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
