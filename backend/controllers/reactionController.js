const Reaction = require("../models/Reaction");
const Post = require("../models/Post"); 
const { createNotification } = require("./notificationController");

// Add or update a reaction
exports.addReaction = async (req, res) => {
  try {
    const { postId, type } = req.body;
    const userId = req.user.id;

    // Make sure post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let reaction = await Reaction.findOne({ user: userId, post: postId });

    if (reaction) {
      reaction.type = type;
      await reaction.save();

      // 🔔 Notify post owner if not same user
      const io = req.app.get("io");
      if (post.user.toString() !== userId) {
        await createNotification(
          post.user,
          "reaction",
          `${req.user.username} reacted to your post`,
          post._id,
          io
        );
      }

      // ✅ Return only reaction object
      return res.status(200).json(reaction);
    }

    // Create new reaction
    reaction = new Reaction({ user: userId, post: postId, type });
    await reaction.save();

    // 🔔 Notify post owner if not same user
    const io = req.app.get("io");
    if (post.user.toString() !== userId) {
      await createNotification(
        post.user,
        "reaction",
        `${req.user.username} reacted to your post`,
        post._id,
        io
      );
    }

    // ✅ Return only reaction object
    res.status(201).json(reaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get reactions for a post
exports.getReactionsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const reactions = await Reaction.find({ post: postId }).populate("user", "username");

    res.json(reactions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
