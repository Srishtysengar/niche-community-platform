const express = require("express");
const router = express.Router();
const {
  createPoll,
  votePoll,
  getPollsByCommunity,
} = require("../controllers/pollController");
const { protect } = require("../middlewares/authMiddleware");

// POST /api/polls → create poll
router.post("/", protect, createPoll);

// POST /api/polls/:id/vote → vote on a poll
router.post("/:id/vote", protect, votePoll);

// GET /api/polls/:communityId → get polls in a community
router.get("/:communityId", protect, getPollsByCommunity);

module.exports = router;
