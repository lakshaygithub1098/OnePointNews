// 📁 server/routes/interactions.js

import express from "express";
import Interaction from "../models/Interaction.js";

const router = express.Router();

// ✅ GET interaction stats for multiple postIds
router.post("/stats", async (req, res) => {
  const { postIds } = req.body;

  try {
    const stats = await Interaction.find({ postId: { $in: postIds } });

    const statsMap = {};
    stats.forEach((stat) => {
      statsMap[stat.postId] = { likes: stat.likes, views: stat.views };
    });

    res.json(statsMap);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ✅ POST: increase like
router.post("/like/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const interaction = await Interaction.findOneAndUpdate(
      { postId },
      { $inc: { likes: 1 } },
      { new: true, upsert: true }
    );
    res.json({ likes: interaction.likes });
  } catch (err) {
    res.status(500).json({ error: "Failed to like post" });
  }
});

// ✅ POST: increase view
router.post("/view/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const interaction = await Interaction.findOneAndUpdate(
      { postId },
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );
    res.json({ views: interaction.views });
  } catch (err) {
    res.status(500).json({ error: "Failed to increase view" });
  }
});

// ✅ Add in routes/interactions.js or a new one if needed
router.post("/stats", async (req, res) => {
  const { postIds } = req.body;
  const stats = {};

  for (const id of postIds) {
    const record = await PostStats.findOne({ postId: id });
    stats[id] = {
      likes: record?.likes || 0,
      views: record?.views || 0,
    };
  }

  res.json(stats);
});


export default router;
