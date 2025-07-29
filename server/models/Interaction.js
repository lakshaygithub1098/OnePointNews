// 📁 server/models/Interaction.js

import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
});

const Interaction = mongoose.model("Interaction", interactionSchema);
export default Interaction;
