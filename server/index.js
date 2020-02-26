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
const PLAYERS_REQUIRED = 2;

const router = require("./router");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//SOCKETS
io.on("connection", async socket => {
  console.log("New connection");

  socket.on("close", async ({ username }, callback) => {
    removeUserFromLobby(socket, username);
  });

  socket.on("joinQueue", async ({ username }, callback) => {
    addUserToLobby(socket, username);
  });

  socket.on("picture", async ({ username, picture }, callback) => {
    socket.broadcast.emit("picture", picture);
  });
});

async function updateLobby() {
  clientIds = Object.keys(io.sockets.adapter.rooms["lobby"].sockets);
  var usernames = [];

  clientIds.map(id => {
    usernames.push(io.sockets.connected[id].username);
  });

  io.to("lobby").emit("queue", usernames);
}

async function addUserToLobby(socket, username) {
  socket.username = username;
  socket.join("lobby");
  updateLobby();
  gameReady();
}

async function removeUserFromLobby(socket, username) {
  socket.leave("lobby");
  socket.disconnect();
  updateLobby();
}

async function gameReady() {
  const clientIds = Object.keys(io.sockets.adapter.rooms["lobby"].sockets);

  if (clientIds.length == 2) {
    console.log("Server attempting to start game");
    let game_id = createGameCode();
    clientIds.map(clientId => {
      console.log(clientId);
      io.sockets.sockets[clientId].leave("lobby");
      io.sockets.sockets[clientId].join(`game_${game_id}`);
    });

    //updateLobby();
    const gamers = Object.keys(
      io.sockets.adapter.rooms[`game_${game_id}`].sockets
    );
    console.log(gamers);

    io.in(`game_${game_id}`).emit("startGame", `game_${game_id}`);

    startGame(`game_${game_id}`, gamers);
  }
}

function createGameCode() {
  return Math.random()
    .toString(36)
    .substring(7);
}

function startGame(room_id, clients) {
  startRound(clients, room_id);
}

function startRound(clients, room_id) {
  console.log("START ROUND");
  console.log(clients[0]);

  setTimeout(function() {
    console.log("TRIGGER");
    io.to(clients[0]).emit("changeScreen", 1);
    io.to(clients[1]).emit("changeScreen", 2);
  }, 5000);
}

app.use(router);

server.listen(PORT, () => {
  console.log("Server has started");

  //Lobby.create({ name: "lobby" });
});
