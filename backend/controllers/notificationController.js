const Notification = require("../models/notificationModel");

// Utility function - create a new notification
exports.createNotification = async (userId, type, message, entityId, io) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      entityId,
    });

    // Emit to specific user in Socket.IO (room = userId)
    if (io) {
      io.to(userId.toString()).emit("notification", notification);
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error.message);
  }
};

// Get all notifications for logged in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
