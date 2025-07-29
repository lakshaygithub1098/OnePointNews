import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

const fetchNewsFromAPI = async () => {
  const url = `https://newsapi.org/v2/top-headlines?country=in&pageSize=10&apiKey=${NEWS_API_KEY}`;
  const response = await axios.get(url);
  
  return response.data.articles.map(article => ({
    title: article.title,
    url: article.url,
    image: article.urlToImage,      
    publishedAt: article.publishedAt,
    source: article.source.name,
    description: article.description,
    category: "General",
  }));
};

module.exports = fetchNewsFromAPI;
