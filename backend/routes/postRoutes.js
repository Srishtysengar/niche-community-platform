const express = require("express");
const router = express.Router();
const {
  createPost,
  getPostsByCommunity,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload"); // Multer middleware

// POST /api/posts → create post (with optional media upload)
router.post("/", protect, upload.single("media"), createPost);

// GET /api/posts/:communityId → get posts by community
router.get("/:communityId", protect, getPostsByCommunity);

module.exports = router;
