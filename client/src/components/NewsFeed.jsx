import React, { useEffect, useState } from "react";

const NewsFeed = ({ selectedCategory }) => {
  const [newsPosts, setNewsFeed] = useState([]);
  const [stats, setStats] = useState({});
  const [likedPosts, setLikedPosts] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (!selectedCategory) return;

    fetch(`https://onepointnews-server.onrender.com/api/news/${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        const posts = data.feed || [];
        setNewsFeed(posts);

        // Initialize stats for each post
        const initialStats = {};
        posts.forEach((post) => {
          initialStats[post._id] = { likes: 0, views: 0 };
        });
        setStats(initialStats);
      })
      .catch((err) => console.error("❌ Error loading feed:", err));
  }, [selectedCategory]);

  const handleView = (postId) => {
    setStats((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        views: (prev[postId]?.views || 0) + 1
      }
    }));
  };

  const handleLike = (postId) => {
    // Toggle liked state
    const wasLiked = likedPosts[postId];
    const updatedLikedPosts = { 
      ...likedPosts, 
      [postId]: !wasLiked 
    };
    setLikedPosts(updatedLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));

    // Update stats - increment or decrement likes
    setStats((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        likes: (prev[postId]?.likes || 0) + (wasLiked ? 1 : -1)
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 space-y-4">
      {newsPosts.length === 0 ? (
        <p className="text-[var(--color-text-secondary)] text-center">⚠️ No news posts found for this category.</p>
      ) : (
        newsPosts.map((post) => {
          const postStats = stats[post._id] || { likes: 0, views: 0 };
          return (
            <div
              key={post._id}
              className="bg-[var(--color-surface)] rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 p-4 pb-0">
                <img src="images/images.png" alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm text-[var(--color-text-primary)] font-medium">{post.source}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{new Date(post.time).toLocaleString()}</p>
                </div>
              </div>

              <img src={post.img} alt={post.title} className="w-full h-60 object-cover mt-2" />

              <div className="p-4">
                <h2 className="text-[var(--color-text-primary)] font-semibold text-lg mb-1">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleView(post._id)}
                    style={{ cursor: "pointer" }}
                  >
                    {post.title}
                  </a>
                </h2>
                <p className="text-sm text-[var(--color-text-primary)] mb-3">{post.description}</p>

                <div className="flex items-center text-sm text-[var(--color-text-secondary)] gap-6">
                  <div className="flex items-center gap-1">👁️ {postStats.views}</div>
                  <button 
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1 transition-colors ${
                      likedPosts[post._id] 
                        ? 'text-red-500' 
                        : 'hover:text-red-500 cursor-pointer'
                    }`}
                  >
                    {likedPosts[post._id] ? '❤️' : '🤍'} {postStats.likes}
                  </button>
                  <a href={post.url} target="_blank" rel="noreferrer" className="ml-auto">🔗</a>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default NewsFeed;
