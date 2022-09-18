const Room = require("../models/room");
const User = require("../models/user");
var ObjectId = require("mongodb").ObjectID;

/**
 *
 * @param {user object} user
 * @param {string} room_id
 * @returns user object
 * 1. find the room by id
 * 2. push the user into the users in the room
 * 3. update the room
 */
async function userJoin(user, socket_id, room_id) {
  // console.log(user, socket_id, room_id);
  const room = await Room.findById(room_id);
  const user_id = user._id.valueOf();
  //If the current exists in the room, delete it
  await Room.updateMany(
    { _id: room_id },
    { $pull: { sockets: { user: { $in: [ObjectId(user_id)] } } } }
  );
  room.sockets.push({ socket_id, user });
  await room.save();
  const newRoom = await Room.findById(room_id);
  return newRoom;
}
/**
 *
 * @param {string} id
 * @returns user object
 */
async function getCurrentUser(id) {
  const user = await User.findById(id);
  return user;
}

/**
 *
 * @param {string} userId: the user going to leave
 * @param {string} roomId: the room that the user is going to leave
 * @returns the leaving user
 *
 */
async function userLeave(user_id, room_id) {
//   console.log(room_id, user_id);
  await Room.updateMany(
    { _id: room_id },
    { $pull: { sockets: { user: { $in: [ObjectId(user_id)] } } } }
  );
  const user = await User.findById(user_id);
  return user;
}

/**
 *
 * @param {string} roomId
 * @returns the list of users in the room(roomId)
 */
async function getRoomUsers(room_id) {
    const room = await Room.findById(room_id).populate('sockets.user');
    if(room !== null) 
        return room.sockets.map(socket=>socket.user);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
