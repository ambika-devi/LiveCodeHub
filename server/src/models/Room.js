const mongoose = require('mongoose');

const CursorSchema = new mongoose.Schema({
  userId: String,
  position: Object
}, { _id: false });

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },  // IMPORTANT
  name: String,
  doc: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  createdAt: { type: Date, default: Date.now },
  cursors: [CursorSchema]
});

module.exports = mongoose.model('Room', RoomSchema);
