const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { mongoose } = require("./connection.js");
const ObjectId = require("mongodb").ObjectID;
const {
  Game,
  Round,
  Guess,
  Canvas,
  Word,
  User,
  Lobby
} = require("./models/models.js");
const ip = require("ip");

const PORT = process.env.PORT || 5000;

const router = require("./router");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", async socket => {
  console.log("New connection");

  socket.on("close", async ({ username }, callback) => {
    console.log("Disconnect");

    socket.disconnect();
  });

  socket.on("joinQueue", async ({ username }, callback) => {
    // Get user
    User.findOne({ username: username }).then(async user => {
      //Add player to queue
      Lobby.updateOne({ name: "lobby" }, { $push: { queue: user } }).then(
        async lobby => {
          checkQueue();
        }
      );
    });
  });
});

const checkQueue = async lobby => {
  let lobbyObject;
  let GAME_USERS = 4;

  //Lobby has sometimes already been called so this removes unnesecary database call
  if (lobby == null) {
    await Lobby.findOne({ name: "lobby" }).then(lob => {
      lobbyObject = lob;
    });
  } else {
    lobbyObject = lobby;
  }

  if (lobbyObject.queue.length >= GAME_USERS) {
    //Game created with first X users

    let game_users = lobbyObject.slice(0, GAME_USERS);
    createGame(game_users);

    //Remove users from queue
    await Lobby.updateOne(
      { name: "lobby" },
      { $pull: { queue: { $in: game_users } } }
    );
  }
};

const createGame = users => {
  console.log(createGame);
};

app.use(router);

server.listen(PORT, () => {
  console.log("Server has started");

  Lobby.create({ name: "lobby" });
});
