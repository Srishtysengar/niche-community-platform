const Poll = require("../models/Poll");
const { createNotification } = require("./notificationController"); // helper

exports.createPoll = async (req, res) => {
  try {
    const { question, options, communityId, expiresAt } = req.body;
    const creator = req.user.id;

    if (!question || !options || options.length < 2) {
      return res
        .status(400)
        .json({ message: "Poll must have a question and at least 2 options" });
    }

    const poll = new Poll({
      question,
      options: options.map((opt) => ({ text: opt })),
      community: communityId,
      creator,
      expiresAt,
    });

    await poll.save();
    res.status(201).json({ message: "Poll created", poll });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const userId = req.user.id;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // remove user from any previous votes
    poll.options.forEach((opt) => {
      opt.votes = opt.votes.filter((v) => v.toString() !== userId);
    });

    // add vote to selected option
    if (!poll.options[optionIndex]) {
      return res.status(400).json({ message: "Invalid option index" });
    }
    poll.options[optionIndex].votes.push(userId);

    await poll.save();

    // 🔔 Notify poll creator (if not the same user)
    const io = req.app.get("io");
    if (poll.creator.toString() !== userId) {
      await createNotification(
        poll.creator,
        "poll",
        `${req.user.username} voted on your poll`,
        poll._id,
        io
      );
    }

    res.json({ message: "Vote recorded", poll });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPollsByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const polls = await Poll.find({ community: communityId }).populate(
      "creator",
      "username"
    );
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
