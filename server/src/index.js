// Load environment variables from .env into process.env
require('dotenv').config();

// Import the express framework
const express = require('express');

// Node's http module used to create a server that Socket.IO will attach to
const http = require('http');

// Cross-origin middleware so the frontend (Vercel origin) can call our API
const cors = require('cors');

// Mongoose ORM for MongoDB
const mongoose = require('mongoose');

// Socket.IO library to enable WebSocket & fallback transports
const socketio = require('socket.io');

// Import REST routes for room operations (create, get)
const roomsRouter = require('./routes/rooms');

// Create an Express app
const app = express();

// Allow cross-origin requests. In production restrict { origin: 'https://your-vercel-domain' }
app.use(cors());

// Parse incoming JSON bodies into req.body
app.use(express.json());

// Mount the rooms router under /rooms
app.use('/rooms', roomsRouter);

// Create an HTTP server from the Express app.
// Socket.IO needs this to bind to the same server (so sockets & HTTP share port)
const server = http.createServer(app);

// Create a Socket.IO server attached to our HTTP server.
// We configure CORS so the browser can open socket connections from the client origin.
const io = socketio(server, {
  cors: { origin: '*' } // TODO: replace * with production origin
});

// Import and register socket event handlers (see socket.js)
require('./socket')(io);

// Read port from env or default to 4000
const PORT = process.env.PORT || 4000;

// MongoDB connection string; use docker-compose/mongo in local or a managed DB in prod
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realtime_code';

// Connect to MongoDB using Mongoose, then start server on success
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Mongo connection error:", err);
  });

