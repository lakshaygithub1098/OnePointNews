import express from "express";
import { getNews } from "../controllers/newsController.js";

const router = express.Router();

// Add this route to handle category
router.get("/:category", getNews);

// Optional: fallback to 'all' if no category provided
router.get("/", (req, res) => {
  req.params.category = "all";
  getNews(req, res);
});

export default router;
