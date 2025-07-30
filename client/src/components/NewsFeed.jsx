import React, { useEffect, useState } from "react";

const NewsFeed = ({ selectedCategory }) => {
  // ...existing state declarations...

  const handleLike = (postId) => {
    // Toggle liked state (1 or 0)
    const wasLiked = likedPosts[postId];
    const updatedLikedPosts = { 
      ...likedPosts, 
      [postId]: !wasLiked 
    };
    setLikedPosts(updatedLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));

    // Update stats - set to 1 or 0
    setStats((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        likes: wasLiked ? 0 : 1
      }
    }));
  };

  // Update the button rendering in your JSX to show correct count:
  <button 
    onClick={() => handleLike(post._id)}
    className={`flex items-center gap-1 transition-colors ${
      likedPosts[post._id] 
        ? 'text-red-500' 
        : 'hover:text-red-500 cursor-pointer'
    }`}
  >
    {likedPosts[post._id] ? '❤️' : '🤍'} {postStats.likes ? 1 : 0}
  </button>
