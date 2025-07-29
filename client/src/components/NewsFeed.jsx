
import React, { useEffect, useState } from "react";

const NewsFeed = ({ selectedCategory }) => {
  const [newsPosts, setNewsFeed] = useState([]);
const [stats, setStats] = useState({}); 

  useEffect(() => {
    if (!selectedCategory) return;

    fetch(`http://localhost:5000/api/news/${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        const posts = data.feed || [];
        setNewsFeed(posts);

        const postIds = posts.map((p) => p._id);

        fetch("http://localhost:5000/api/interactions/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postIds }),
        })
          .then((res) => res.json())
          .then((statsData) => {
            const newStats = {};
            postIds.forEach((id) => {
              newStats[id] = statsData[id] || { likes: 0, views: 0 };
            });
            setStats(newStats);
          });
      })
      .catch((err) => console.error("❌ Error loading feed:", err));
  }, [selectedCategory]);

  const handleView = (postId) => {
    fetch(`http://localhost:5000/api/interactions/view/${postId}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ views }) => {
        setStats((prev) => ({ ...prev, [postId]: { ...prev[postId], views } }));
      })
      .catch((err) => {
        console.error("Error increasing views:", err);
      });
      
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/interactions/like/${postId}`, {
        method: "POST",
      });
      const { likes } = await res.json();
      setStats((prev) => ({ ...prev, [postId]: { ...prev[postId], likes } }));
    } catch (err) {
      console.error(" Error increasing likes:", err);
    }
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
                  <button onClick={() => handleLike(post._id)}>
                    <div className="flex items-center gap-1">❤️ {postStats.likes}</div>
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
