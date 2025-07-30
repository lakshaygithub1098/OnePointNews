import React, { useEffect, useState } from "react";

const NewsFeed = ({ selectedCategory }) => {
  const [newsPosts, setNewsFeed] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() => {
    const storedLikes = localStorage.getItem("likedPosts");
    return storedLikes ? JSON.parse(storedLikes) : {};
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!selectedCategory) return;

    // ✅ Updated backend URL here
    fetch(`https://onepointnews-server.onrender.com/api/news/${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        setNewsFeed(data);

        // Initialize stats with default likes = 0
        const initialStats = {};
        data.forEach((post) => {
          initialStats[post._id] = {
            likes: likedPosts[post._id] ? 1 : 0,
            views: 0,
          };
        });
        setStats(initialStats);
      });
  }, [selectedCategory]);

  const handleLike = (postId) => {
    const wasLiked = likedPosts[postId];
    const updatedLikedPosts = {
      ...likedPosts,
      [postId]: !wasLiked,
    };
    setLikedPosts(updatedLikedPosts);
    localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));

    setStats((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        likes: !wasLiked ? 1 : 0,
      },
    }));
  };

  return (
    <div className="news-feed">
      {newsPosts.map((post) => {
        const postStats = stats[post._id] || { likes: 0, views: 0 };

        return (
          <div key={post._id} className="news-post p-4 border-b">
            <h2 className="text-lg font-bold">{post.title}</h2>
            <p>{post.summary}</p>

            <button
              onClick={() => handleLike(post._id)}
              className={`flex items-center gap-1 mt-2 transition-colors ${
                likedPosts[post._id]
                  ? "text-red-500"
                  : "hover:text-red-500 cursor-pointer"
              }`}
            >
              {likedPosts[post._id] ? "❤️" : "🤍"} {postStats.likes}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NewsFeed;
