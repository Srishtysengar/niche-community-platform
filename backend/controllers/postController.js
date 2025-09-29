const Post = require("../models/Post");
const Community = require("../models/Community");

// --------------------
// Create a new post
// --------------------
exports.createPost = async (req, res) => {
  try {
    const { title, content, communityId } = req.body;

    // Make sure community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Build new post object
    const newPost = new Post({
      title,
      content,
      community: communityId,
      user: req.user.id, // ✅ comes from auth middleware
    });

    // If media uploaded
    if (req.file) {
      newPost.mediaUrl = `/uploads/${req.file.filename}`;
      newPost.mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
    }

    // Save post
    await newPost.save();

    // Populate user info for frontend
    await newPost.populate("user", "username email");

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------
// Get posts by community
// --------------------
exports.getPostsByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const posts = await Post.find({ community: communityId })
      .populate("user", "username email") // include user info
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
