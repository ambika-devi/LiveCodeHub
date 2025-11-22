// Load the Room Mongoose model which stores room doc and cursors
const Room = require('./models/Room');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    // JOIN ROOM
    socket.on('join-room', async ({ roomId, userId }) => {
      try {
        socket.join(roomId);

        socket.data.userId = userId || socket.id;
        socket.data.roomId = roomId;

        // FIND OR CREATE ROOM
        let room = await Room.findOne({ roomId });

        if (!room) {
          console.log("⚠ Room not found, creating:", roomId);
          room = await Room.create({
            roomId,
            doc: "",
            language: "javascript",
          });
        }

        // Send full room data to the joined user
        socket.emit('room-data', {
          doc: room.doc,
          language: room.language,
        });

        // Notify other users
        socket.to(roomId).emit('user-joined', {
          userId: socket.data.userId,
        });

      } catch (err) {
        console.error('join-room err', err);
      }
    });

    // DOCUMENT CHANGES
    socket.on('editor-change', async ({ roomId, doc }) => {
      try {
        // Broadcast to other clients
        socket.to(roomId).emit('editor-update', { doc, from: socket.id });

        // Save document to DB 
        await Room.findOneAndUpdate(
          { roomId },
          { doc },
          { new: true }
        );

      } catch (err) {
        console.error('editor-change err', err);
      }
    });

    // CURSOR UPDATES (not saved to DB)
    socket.on('cursor-update', ({ roomId, userId, cursor }) => {
      socket.to(roomId).emit('cursor-update', { userId, cursor });
    });

    // RUN CODE
    socket.on('run-code', async ({ roomId, code, language }) => {
      try {
        const axios = require('axios');
        const runnerUrl = process.env.RUNNER_URL || 'http://localhost:5000';

        const resp = await axios.post(
          `${runnerUrl}/run`,
          { code, language },
          { timeout: 20000 }
        );

        socket.emit('run-output', { output: resp.data });

      } catch (err) {
        console.error('run-code err', err.message);
        socket.emit('run-output', { error: err.message });
      }
    });

    // DISCONNECT HANDLER
    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);

      const { roomId } = socket.data;
      if (roomId) {
        socket.to(roomId).emit('user-left', {
          userId: socket.data.userId,
        });
      }
    });
  });
};
