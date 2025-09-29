const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const communityRoutes = require('./routes/communityRoutes');
app.use('/api/communities', communityRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comments', commentRoutes);

const reactionRoutes = require("./routes/reactionRoutes");
app.use("/api/reactions", reactionRoutes);

const pollRoutes = require("./routes/pollRoutes");
app.use("/api/polls", pollRoutes);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

app.use("/uploads", express.static("uploads"));



// MongoDB connection
const connectDB = require('./config/db');
connectDB();

// Create HTTP server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Socket.io setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Frontend should emit "join" after login with their userId
  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId.toString()); // create/join a personal room
      console.log(`User ${userId} joined their room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
