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

    await Lobby.updateOne(
      { name: "lobby" },
      { $pull: { queue: { username: username } } }
    ).then(lob => {
      lobbyObject = lob;
    });
  });

  socket.on("joinQueue", async ({ username }, callback) => {
    socket.join("lobby");
    // Get user
    User.findOne({ username: username }).then(async user => {
      // Remove  this whole if statement after social media login is implemented. Keep else
      if (user == null) {
        console.log("User doesn't exist, needs to login");
        User.create({ username: username }).then(async newUser => {
          Lobby.updateOne(
            { name: "lobby" },
            { $push: { queue: newUser } }
          ).then(async lobby => {
            checkQueue();
          });
        });
      } else {
        //Add player to queue
        Lobby.updateOne({ name: "lobby" }, { $addToSet: { queue: user } }).then(
          async lobby => {
            checkQueue();
          }
        );
      }
    });
  });
});

const joinLobby = () => {};

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

  console.log(lobbyObject);

  io.to("lobby").emit("queue", lobbyObject.queue);

  if (lobbyObject.queue.length >= GAME_USERS) {
    //Game created with first X users
    console.log("START A GAME");
    let game_users = lobbyObject.queue.slice(0, GAME_USERS);
    createGame(game_users);

    //Remove users from queue
    await Lobby.updateOne(
      { name: "lobby" },
      { $pull: { queue: { $in: game_users } } }
    ).then(newLob => {
      console.log(newLob);
    });
  }
};

const createGame = users => {
  console.log(createGame);
};

app.use(router);

server.listen(PORT, () => {
  console.log("Server has started");

  //Lobby.create({ name: "lobby" });
});
