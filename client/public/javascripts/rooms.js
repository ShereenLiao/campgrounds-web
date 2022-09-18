const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const roomUsers = document.getElementById("users");

const { username, _id} = user;
const user_id = _id;

socket.emit("joinRoom", { user, room });

//Message from server
socket.on("message", (message) => {
  outputMessage(message);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //get message text
  const msg = e.target.elements.msg.value;
  //emit message to the server
  socket.emit("chatMessage", { message: msg, room, user });
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
  //after submit the msg to server, clear the form and refouces on the input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
  /**
   * <div class='message'>
   * <p> message</p>
   * </div>
   */
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += ` <span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

//get rooms and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room, users);
  outputRoomUsers(users);
});


//add room name to DOM
function outputRoomName(room, users) {
  roomName.innerText = `${room.title}(${users.length})`;
}

//add users to DOM
function outputRoomUsers(users) {
  roomUsers.innerHTML = "";
  users.forEach((user) => {
    let li = document.createElement("li");
    li.innerText = user.username;
    roomUsers.appendChild(li);
  });
}




