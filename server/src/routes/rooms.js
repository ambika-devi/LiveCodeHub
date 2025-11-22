const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// Create a new room
router.post('/create', async (req, res) => {
  try {
    // If client doesn't provide a name, create a timestamp-based name
    const name = req.body.name || `Room-${Date.now()}`;

    // Create new Room record with optional doc and language
    const room = new Room({ name, doc: req.body.doc || '', language: req.body.language || 'javascript' });

    // Save to MongoDB
    await room.save();

    // Return success and the new room ID
    return res.json({ ok: true, id: room._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Get room metadata & content
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.id });
    if (!room) return res.status(404).json({ ok: false, error: 'Room not found' });
    return res.json({ ok: true, room });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
