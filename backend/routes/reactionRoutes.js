const express = require("express");
const router = express.Router();
const {
  addReaction,
  getReactionsForPost,
} = require("../controllers/reactionController");
const { protect } = require("../middlewares/authMiddleware");

// POST /api/reactions → add/update reaction
router.post("/", protect, addReaction);

// GET /api/reactions/:postId → get reactions for a post
router.get("/:postId", protect, getReactionsForPost);

module.exports = router;
