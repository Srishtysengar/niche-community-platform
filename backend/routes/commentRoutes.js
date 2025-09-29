const express = require("express");
const router = express.Router();
const {
  addComment,
  getCommentsByPost,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

// POST /api/comments → add comment
router.post("/", protect, addComment);

// GET /api/comments/:postId → get comments by post
router.get("/:postId", protect, getCommentsByPost);

module.exports = router;
