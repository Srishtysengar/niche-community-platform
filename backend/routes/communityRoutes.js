const express = require("express");
const router = express.Router();
const { createCommunity, getCommunities, joinCommunity } = require("../controllers/communityController");
const { protect } = require("../middlewares/authMiddleware");

// POST /api/communities → create a new community
router.post("/", protect, createCommunity);

// GET /api/communities → list all communities
router.get("/", protect, getCommunities);

// POST /api/communities/join/:id → join a community
router.post("/:id/join", protect, joinCommunity);

module.exports = router;
