import React, { useEffect, useState } from "react";

const NewsFeed = ({ selectedCategory }) => {
  const [newsPosts, setNewsFeed] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() => {
    const stored = localStorage.getItem("likedPosts");
    return stored ? JSON.parse(stored) : {};
  });
  const [stats, setStats] = useState({});

  // ✅ Fetch from Render deployed backend
  useEffect(() => {
    if (!selectedCategory) return;

    fetch(`https://your-render-backend-url.com/api/news/${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("News data is not an array:", data);
          setNewsFeed([]);
          return;
        }

        setNewsFeed(data);

        // Initialize like stats for each post
        const initialStats = {};
        data.forEach((post) => {
          initialStats[post._id] = {
            likes: likedPosts[post._id] ? 1 : 0,
            views: 0, // optional
          };
        });
        setStats(initialStats);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setNewsFeed([]);
      });
  }, [selectedCategory]);

  // ✅ Handle like toggle
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
      {newsPosts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No posts available.</p>
      ) : (
        newsPosts.map((post) => {
          const postStats = stats[post._id] || { likes: 0, views: 0 };

          return (
            <div
              key={post._id}
              className="news-post p-4 border-b border-gray-200"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600">{post.summary}</p>

              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-1 transition-colors ${
                    likedPosts[post._id]
                      ? "text-red-500"
                      : "hover:text-red-500 cursor-pointer"
                  }`}
                >
                  {likedPosts[post._id] ? "❤️" : "🤍"} {postStats.likes}
                </button>

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Read more
                </a>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default NewsFeed;
