const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    // Validate input
    if (!text || !postId) {
      return res.status(400).json({ message: "Post ID and text are required" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create new comment
    const comment = new Comment({
      text,
      post: postId,
      author: req.user.id, //  use "author" to match schema
    });

    await comment.save();
    await comment.populate("author", "username email");

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get comments for a post
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username email") //  use "author"
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error" });
  }
};
