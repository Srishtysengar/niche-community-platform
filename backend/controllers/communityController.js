const Community = require('../models/Community');

exports.createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Community.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Community name already exists' });

    const community = new Community({
      name,
      description,
      creator: req.user.id,
      members: [req.user.id],
    });

    await community.save();
    res.status(201).json(community);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const { id } = req.params; // community id
    const community = await Community.findById(id);

    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (community.members.includes(req.user.id))
      return res.status(400).json({ message: 'Already a member' });

    community.members.push(req.user.id);
    await community.save();

    //Return updated community directly
    res.json(community);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};


exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate('creator', 'username');
    res.json(communities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
};
