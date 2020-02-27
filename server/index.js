const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { mongoose } = require("./connection.js");
const ObjectId = require("mongodb").ObjectID;
const fs = require("fs");
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

let game_rooms = [];

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

  socket.on("answer", async ({ answer }, callback) => {
    console.log(answer);

    const round = getRound(socket);
    const correct = isAnswerCorrect(round, answer);
    const partner_socket = getPartnerSocket(socket, round);

    if (correct) {
      io.to(socket.id).emit("evaluation", { correct: correct });
    } else {
      io.to(socket.id).emit("evaluation", {
        correct: correct,
        answer: round.correctWord
      });
    }

    io.to(partner_socket).emit("evaluation", {
      correct: correct,
      answer: answer
    });
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

function getRound(socket) {
  //TODO: The user might not be leaving the lobby and has two rooms for some reason
  let user_rooms = Object.keys(socket.rooms);
  let room_id = user_rooms[user_rooms.length - 1];
  let game_room = game_rooms.find(({ id }) => id === room_id);
  let currentRound = game_room.rounds[game_room.rounds.length - 1];
  return currentRound;
}

function getPartnerSocket(socket, round) {
  let partner = round.partners.find(({ guesser }) => guesser === socket.id)
    .artist;

  return partner;
}

function isAnswerCorrect(round, answer) {
  return round.correctWord === answer;
}

function startGame(room_id, clients) {
  startRound(clients, room_id);
  game_rooms.push({ id: room_id, rounds: [] });
}

function startRound(clients, room_id) {
  console.log("START ROUND");

  var partners = [];
  partners.push({ artist: clients[0], guesser: clients[1] });

  setTimeout(function() {
    words = getWords();
    const correctWord = words[0];
    let game_room = game_rooms.find(({ id }) => id === room_id);
    let round = { partners: partners, words: words, correctWord: correctWord };
    game_room.rounds.push(round);

    io.to(clients[0]).emit("artistInformation", words[0]);

    shuffle(words);
    io.to(clients[1]).emit("guesserInformation", words);

    //WAIT ONE SECOND TO MAKE SURE USERS HAVE THE INFORMATION
    setTimeout(function() {
      io.to(clients[0]).emit("changeScreen", 1);
      io.to(clients[1]).emit("changeScreen", 2);
    }, 1000);

    io.to(clients[0]).emit("changeScreen", 1);
    io.to(clients[1]).emit("changeScreen", 2);
  }, 2000);
}

function getWords() {
  let words = [];
  let text = fs.readFileSync("words.txt", "utf8");

  words = text.toString().split("\n");

  let chosenWords = [];

  for (var i = 0; i < 4; i++) {
    let index = Math.floor(Math.random() * 100);

    if (!chosenWords.includes(words[index])) {
      chosenWords.push(words[index]);
    } else {
      i--;
    }
  }

  return chosenWords;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

app.use(router);

server.listen(PORT, () => {
  console.log("Server has started");

  //Lobby.create({ name: "lobby" });
});
