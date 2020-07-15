const express = require("express");
const connectDB = require("./config/db");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//Database connect
connectDB();
const PORT = process.env.PORT || 5000;

// Run socket when user is connected
io.on("connection", (socket) => {
  console.log("a socket connected");
  socket.on("joinChat", (chatId, cb) => {
    socket.join(chatId);
    //welcome user
    cb({ msg: `welcome to ${chatId}` });
  });

  //Listen for text messages
  socket.on("textMessage", (message) => {
    //send listened msg to client
    io.to(message.chatId).emit("message", message);
    // console.log(message);

    //Broadcasting a user joined like lastseen online
    // socket.broadcast.to(chatId).emit('message', `${chatId} has joined`);

    //while user left the chat
    socket.on("disconnect", () => {
      //disconnect socket
      io.to(message.chatId).emit(
        "message",
        `${message.user.firstName} disconnected from chat`
      );
    });
  });
});

// @Routes
app.use("/api/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/api/login", require("./routes/login"));

app.use("/api/chat", require("./routes/chat"));
app.use("/api/messages", require("./routes/messages"));
//Home route
app.get("/", (req, res) => {
  res.send("home");
});
// Server connect
server.listen("5000", () => {
  console.log(`Server started successfully on port ${PORT}`);
});
