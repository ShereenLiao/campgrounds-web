//If we work in production mode, don't import.env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const { v4: uuid } = require("uuid"); //For generating unique ID's
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const { nextTick } = require("process");
const ExpressError = require("./utils/ExpressError");
const { join } = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//add socket.io into code
const http = require("http").Server(app);
const io = require("socket.io")(http);

//import utils for users and messages
const formatMessage = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const { getRoom } = require("./utils/room");
const botName = "ChatBox Bot";

//Split the routes: campgrounds, reviews, users
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const roomRoute = require("./routes/rooms");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const MongoStore = require("connect-mongo");

//localhost: mongodb://localhost:27017/yelp-camp
//Connect to yelp-camp in Mongodb using localhost on port 27017.
//Mongoose 6 always behaves as if useNewUrlParser , useUnifiedTopology , and useCreateIndex are true , and useFindAndModify is false .
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Views folder and EJS setup:
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//To use EJS template engine
app.engine("ejs", ejsMate);

// To use delete, put and patch requests
app.use(methodOverride("_method"));
//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }));
// To parse incoming JSON in POST request body:
app.use(express.json());
//To specifies the root directory from which to serve static assets.
app.use(express.static(path.join(__dirname, "public")));

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const sessionConfig = {
  store: MongoStore.create({ mongoUrl: dbUrl }),
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //The cookie cannot be accessed through cliend side script
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
//To use flash to store message
app.use(flash());

//To use passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Apply the middleware to send the success and error message
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

//Use the routes: campgrounds, reviews, users
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/campgrounds/:id/rooms", roomRoute);

// *********************************************
// Root - renders the home page
// *********************************************
app.get("/", (req, res) => {
  // res.render('home')
  res.render("home");
});

// ***********************************************
// Error Handler- browse route that not exists
// ***********************************************
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ***********************************************
// Error Handler- send error message
// ***********************************************
app.use((err, req, res, next) => {
  //default statusCode=500, message = 'Something went wrong'
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

io.on("connection", (socket) => {
  /**
   * broadcase when a user connects
   * io.emit(): broadcast to every user in the websocket
   * socket.emit(): to the current user
   * broadcast.emit(): broadcast to every user connected to the web socket except the currrent connection
   */

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
