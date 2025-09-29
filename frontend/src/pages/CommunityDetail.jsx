/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostsByCommunity } from "../features/post/postSlice";
import {
  fetchCommentsByPost,
  addComment,
} from "../features/comment/commentSlice";
import { reactToPost } from "../features/reaction/reactionSlice"; // import reactions
import API from "../api/axiosInstance";

const CommunityDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.post);
  const { communities } = useSelector((state) => state.community);
  const { byPost: comments, loading: commentsLoading } = useSelector(
    (state) => state.comments
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [newComment, setNewComment] = useState({}); // per-post new comment input

  // Find current community
  const community = communities.find((c) => c._id === id);

  useEffect(() => {
    dispatch(fetchPostsByCommunity(id));
  }, [dispatch, id]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim() && !file) return;

    const formData = new FormData();
    formData.append("communityId", id);
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("media", file);

    try {
      const { data } = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch({ type: "post/create/fulfilled", payload: data });
      setTitle("");
      setContent("");
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = (postId) => {
    if (!newComment[postId] || !newComment[postId].trim()) return;
    dispatch(addComment({ postId, text: newComment[postId] }));
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleFetchComments = (postId) => {
    // Always refresh from backend when button clicked
    dispatch(fetchCommentsByPost(postId));
  };

  // Handle Reaction
  const handleReaction = (postId, type) => {
    dispatch(reactToPost({ postId, type })).then(() => {
      // Refresh posts after reacting
      dispatch(fetchPostsByCommunity(id));
    });
  };

  return (
    <div className="p-6">
      {/* Community header */}
      <h1 className="text-3xl font-bold text-blue-600 mb-2">
        {community ? community.name : "Community"}
      </h1>
      <p className="text-gray-500 mb-6">{community?.description || ""}</p>

      {/* Post Form */}
      <form onSubmit={handleSubmitPost} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="block"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </form>

      {/* Posts List */}
      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to post!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="border rounded p-4 shadow-sm bg-white"
            >
              {/* Title */}
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                {post.title}
              </h2>

              {/* Content */}
              <p className="text-gray-800 mb-2">{post.content}</p>

              {/* Media */}
              {post.mediaUrl && post.mediaType === "image" && (
                <img src={post.mediaUrl} alt="post" className="rounded-lg" />
              )}
              {post.mediaUrl && post.mediaType === "video" && (
                <video
                  src={post.mediaUrl}
                  controls
                  className="rounded-lg w-full"
                />
              )}

              {/* Author */}
              <p className="text-sm text-gray-500 mt-2">
                by {post.user?.username || "Unknown"}
              </p>

              {/* ✅ Reactions */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleReaction(post._id, "like")}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  👍 Like (
                  {post.reactions?.filter((r) => r.type === "like").length || 0})
                </button>
                <button
                  onClick={() => handleReaction(post._id, "love")}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  ❤️ Love (
                  {post.reactions?.filter((r) => r.type === "love").length || 0})
                </button>
                <button
                  onClick={() => handleReaction(post._id, "haha")}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  😂 Haha (
                  {post.reactions?.filter((r) => r.type === "haha").length || 0})
                </button>
              </div>

              {/* Comments */}
              <div className="mt-4 border-t pt-3">
                <button
                  onClick={() => handleFetchComments(post._id)}
                  className="text-blue-500 text-sm mb-2"
                >
                  View / Refresh comments
                </button>

                {/* Loading state */}
                {commentsLoading && (
                  <p className="text-gray-500 text-sm">Loading...</p>
                )}

                {comments[post._id] &&
                  comments[post._id].map((c) => (
                    <p key={c._id} className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">
                        {c.user?.username}:
                      </span>{" "}
                      {c.text}
                    </p>
                  ))}

                {/* Add comment form */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newComment[post._id] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    placeholder="Write a comment..."
                    className="flex-1 border p-1 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddComment(post._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
