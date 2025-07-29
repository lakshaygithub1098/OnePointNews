// server/controllers/interactionController.js
import Interaction from "../models/interactionModel.js";

// Like a post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    const interaction = await Interaction.findOneAndUpdate(
      { newsId: id },
      { $inc: { likes: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json(interaction);
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
};

// View a post
export const viewPost = async (req, res) => {
  try {
    const { id } = req.params;

    const interaction = await Interaction.findOneAndUpdate(
      { newsId: id },
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json(interaction);
  } catch (error) {
    res.status(500).json({ message: "Error viewing post", error });
  }
};

// Comment on a post
export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const interaction = await Interaction.findOneAndUpdate(
      { newsId: id },
      { $push: { comments: { text } } },
      { new: true, upsert: true }
    );

    res.status(200).json(interaction);
  } catch (error) {
    res.status(500).json({ message: "Error commenting on post", error });
  }
};

// Get all interactions (likes, views, comments)
export const getInteractions = async (req, res) => {
  try {
    const { id } = req.params;

    const interaction = await Interaction.findOne({ newsId: id });

    res.status(200).json(interaction || { likes: 0, views: 0, comments: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching interactions", error });
  }
};
