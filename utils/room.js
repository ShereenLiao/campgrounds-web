const Room = require("../models/room");

async function getRoom(room_id) {
  const room = await Room.findById(room_id);
  return room;
}

module.exports = {
  getRoom,
};
