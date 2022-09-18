const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

/**
     * broadcase when a user connects
     * io.emit(): broadcast to every user in the websocket
     * socket.emit(): to the current user
     * broadcast.emit(): broadcast to every user connected to the web socket except the currrent connection
     */
io.on("connection", (socket) => {  
    /**
     * Listen on join room
     * 1. call userJoin function to update user into db
     * 2. broadcast to the entering user: username, "welcome to chatcord"
     * 3. join the socket to the room
     * 4. broadcast to room users: `User ${username} has joined the chat`
     * 5. update to all room users the number of users and room title
     */
    socket.on("joinRoom", async ({ user, room }) => {
      const user_id = user._id;
      const { username } = user;
      const room_id = room._id.valueOf();
  
      socket.user_id = user_id;
      socket.room_id = room_id;
  
      const joinedRoom = await userJoin(user, socket.id, room._id);
      console.log(`${user.username} join the room ${room.title}`);
      socket.join(room_id);
      //send message to the joined user
      socket.emit("message", formatMessage(username, "welcome to chatcord"));
      socket.broadcast
        .to(room_id)
        .emit(
          "message",
          formatMessage(username, `User ${username} has joined the chat`)
        );
      //message->all : update room info
      const users = await getRoomUsers(room_id);
      io.to(room_id).emit("roomUsers", {
          room,
          users
      });
    });
  
    //listen to chat message
    socket.on("chatMessage", async (msg) => {
      const { message, user, room } = msg;
      const { _id } = room;
      const roomId = _id.valueOf();
      io.to(roomId).emit("message", formatMessage(user.username, message));
    });
  
    //listen to disconnect(user leave the room)
    socket.on("disconnect", async () => {
      const room_id = socket.room_id;
      const user_id = socket.user_id;
      const user = await userLeave(user_id, room_id);
      if (user) {
        //broad cast to users in the room
        console.log(`${user.username} leave the room `);
        io.to(room_id).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );
      }
      const room =  await getRoom(room_id);
      const users = await getRoomUsers(room_id);
      //send users and room info
      io.to(room_id).emit("roomUsers", {
          room,
          users
      });
    });
  });
  
  //if no environment variable on port, listen on port 3000
  const PORT = 3000 || process.env.PORT;
  http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  