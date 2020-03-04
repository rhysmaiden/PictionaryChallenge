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
let sockets_map = {};

//SOCKETS
io.on("connection", async socket => {
  console.log("New connection");

  socket.on("close", async ({ username }, callback) => {
    removeUserFromLobby(socket, username);
    delete sockets_map[socked.id];
  });

  socket.on("joinQueue", async ({ username }, callback) => {
    addUserToLobby(socket, username);
  });

  socket.on("picture", async ({ username, picture }, callback) => {
    const round = getRound(socket);
    const partner_socket = getPartnerGuesser(socket, round);
    io.to(partner_socket.socket).emit("picture", picture);
  });

  socket.on("answer", async ({ answer, time }, callback) => {
    const round = getRound(socket);
    const correct = isAnswerCorrect(round, answer);
    const partner_socket = getPartnerArtist(socket, round);
    saveAnswer(round, answer, time, socket);

    io.to(partner_socket.socket).emit("evaluation", {
      answer: answer,
      time: time
    });
    io.to(socket.id).emit("evaluation", round.correctWord);

    round.usersAnswered += 1;

    allPartnersAnswered(round, socket);
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
  sockets_map[socket.id] = username;
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

function saveAnswer(round, answer, time, socket) {
  const partnership = round.partners.find(
    ({ guesser }) => guesser.socket === socket.id
  );
  partnership.answer = answer;
  partnership.time = time;

  console.log("Partnership:", partnership);
}

function getPartnerArtist(socket, round) {
  let partner = round.partners.find(
    ({ guesser }) => guesser.socket === socket.id
  ).artist;

  return partner;
}

function getPartnerGuesser(socket, round) {
  let partner = round.partners.find(({ artist }) => artist.socket === socket.id)
    .guesser;

  return partner;
}

function isAnswerCorrect(round, answer) {
  return round.correctWord === answer;
}

function allPartnersAnswered(round, socket) {
  if (round.usersAnswered === round.partners.length) {
    //TODO: 1. Calculate rankings

    //2. Get room id
    let user_rooms = Object.keys(socket.rooms);
    let room_id = user_rooms[user_rooms.length - 1];

    console.log(round.partners);

    //3. Send all results of everyone in room
    io.in(room_id).emit("results", round.partners);

    //4. Tell everyone to change screen to 3
    setTimeout(function() {
      io.in(room_id).emit("changeScreen", 3);
      let game_room = game_rooms.find(({ id }) => id === room_id);

      setTimeout(function() {
        if (!shouldGameEnd(game_room)) {
          startRound(game_room);
        } else {
          endGame(game_room);
        }
      }, 3000);
    }, 2000);
  }
}

function shouldGameEnd(game_room) {
  const roundsCompleted = game_room.rounds.length;
  const totalRounds = game_room.clients.length * 2 - 2;

  if (roundsCompleted >= totalRounds) {
    return true;
  } else {
    return false;
  }
}

function startGame(room_id, users) {
  const clients = [];
  users.map(user => {
    clients.push({ socket: user, username: sockets_map[user] });
  });

  const game_room = { id: room_id, rounds: [], clients: clients };
  game_rooms.push(game_room);
  startRound(game_room);
}

function endGame(game_room) {
  console.log("END GAME");
}

function startRound(game_room) {
  console.log("START ROUND");

  const partners = [];
  partners.push(
    setRoundPartners(game_room.rounds.length + 1, game_room.clients)
  );

  words = getWords();
  const correctWord = words[0];

  let round = {
    partners: partners,
    words: words,
    correctWord: correctWord,
    usersAnswered: 0
  };

  setTimeout(function() {
    io.in(game_room.id).emit("roundInfo", round);
    setTimeout(function() {
      io.in(game_room.id).emit("changeScreen", 0);

      game_room.rounds.push(round);

      partners.map(({ artist, guesser }) => {
        io.to(artist.socket).emit("artistInformation", words[0]);
        shuffle(words);
        io.to(guesser.socket).emit("guesserInformation", words);
      });
    }, 3000);
  }, 1000);

  //WAIT ONE SECOND TO MAKE SURE USERS HAVE THE INFORMATION
  setTimeout(function() {
    partners.map(({ artist, guesser }) => {
      console.log("CHANGE SCREEN");
      console.log(artist);
      io.to(artist.socket).emit("changeScreen", 1);
      io.to(guesser.socket).emit("changeScreen", 2);
    });
  }, 10000);
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

function setRoundPartners(roundNumber, clients) {
  let artist = "";
  let guesser = "";

  if (clients.length == 2) {
    if (roundNumber % 2 == 0) {
      artist = clients[0];
      guesser = clients[1];
    } else {
      artist = clients[1];
      guesser = clients[0];
    }
  }

  return { artist: artist, guesser: guesser };
}

app.use(router);

server.listen(PORT, () => {
  console.log("Server has started");

  //Lobby.create({ name: "lobby" });
});
