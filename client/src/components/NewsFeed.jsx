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

    fetch(`https://onepointnews-server.onrender.com/api/news/${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("News data is not an array:", data);
          setNewsFeed([]);
          return;
        }

        setNewsFeed(data);

        const initialStats = {};
        data.forEach((post) => {
          const isLiked = likedPosts[post._id] ?? true; // default like = true
          initialStats[post._id] = {
            likes: isLiked ? 1 : 0,
            views: 0,
          };
        });
        setStats(initialStats);
      });
  }, [selectedCategory]);

  const handleLike = (postId) => {
    const wasLiked = likedPosts[postId] ?? true; // default = true
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
        const postStats = stats[post._id] || { likes: 1, views: 0 };

        return (
          <div key={post._id} className="news-post p-4 border-b">
            <h2 className="text-lg font-bold">{post.title}</h2>
            <p>{post.summary}</p>

            <button
              onClick={() => handleLike(post._id)}
              className={`flex items-center gap-1 mt-2 transition-colors ${
                likedPosts[post._id] ?? true
                  ? "text-red-500"
                  : "hover:text-red-500 cursor-pointer"
              }`}
            >
              {(likedPosts[post._id] ?? true) ? "❤️" : "🤍"} {postStats.likes}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NewsFeed;
