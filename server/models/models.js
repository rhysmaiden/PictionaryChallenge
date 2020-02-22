const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WordSchema = new Schema({
  correct: String,
  incorrect: [String]
});

const UserSchema = new Schema({
  username: String
});

const CanvasSchema = new Schema({
  data: String
});

const GuessSchema = new Schema({
  drawer: UserSchema,
  picture: CanvasSchema,
  guesser: UserSchema,
  word: WordSchema,
  time: Number,
  answer: String
});

const RoundSchema = new Schema({
  word: WordSchema,
  guesses: [GuessSchema]
});

const GameSchema = new Schema({
  users: [UserSchema],
  rounds: [RoundSchema],
  state: String
});

const LobbySchema = new Schema({
  queue: [UserSchema]
});

const Game = mongoose.model("game", GameSchema);
const Round = mongoose.model("round", RoundSchema);
const Guess = mongoose.model("guess", GuessSchema);
const Canvas = mongoose.model("canvas", CanvasSchema);
const Word = mongoose.model("word", WordSchema);
const User = mongoose.model("user", UserSchema);
const Lobby = mongoose.model("lobby", LobbySchema);

module.exports = { Game, Round, Guess, Canvas, Word, User, Lobby };
