// 📁 server/controllers/newsController.js

import axios from "axios"

const getNews = async (req, res) => {

  const categoryMap = {
  all: null,
  world: "world",
  business: "business",
  technology: "technology",
  
  environment: "environment",
  politics: "politics",
};
  try {
    const apiKey = process.env.NEWS_API_KEY || "2477e82c-04c0-4881-a66f-9f2d1e999c89";

    // Get category from route
   const category = decodeURIComponent(req.params.category)?.toLowerCase();

    // Base URL with Guardian API key and required fields
    let url = `https://content.guardianapis.com/search?api-key=${apiKey}&page-size=10&show-fields=thumbnail,trailText`;

    // If not "all", filter by section (e.g., sport, world, business)
    const apiSection = categoryMap[category];
if (apiSection) {
  url += `&section=${apiSection}`;
}

    const response = await axios.get(url);
    const articles = response.data.response.results;

    if (!articles || articles.length === 0) {
      console.warn("⚠️ No articles returned from Guardian API");
      return res.json({ carousel: [], feed: [] });
    }

    // Map and clean up articles
    const cleanedArticles = articles.map((article) => ({
      _id: article.id, // Use Guardian's unique id as _id
      title: article.webTitle,
      img: article.fields?.thumbnail || "https://via.placeholder.com/400x300?text=No+Image",
      url: article.webUrl,
      time: article.webPublicationDate,
      source: "The Guardian",
      description: article.fields?.trailText || "Click the link to read more.",
      category: article.sectionId,
    }));

    const carousel = cleanedArticles.slice(0, 5);
    const feed = cleanedArticles.slice(0, 10);

    console.log(`✅ [${category}] Articles Fetched:`, cleanedArticles.length);
    res.json({ carousel, feed });
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
 

};

export { getNews };

