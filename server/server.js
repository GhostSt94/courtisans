// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const GameManager = require("./game/GameManager");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  },
});

const gameManager = new GameManager();

const broadcastGameState = (game) => {
  game.players.forEach((player) => {
    io.to(player.id).emit("gameUpdated", game.getStateForPlayer(player.id));
  });
};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Create game
  socket.on("createGame", ({ username }) => {
    const game = gameManager.createGame(socket.id, username);
    socket.join(game.id);
    socket.emit("gameUpdated", game.getStateForPlayer(socket.id));
  });

  // Join game
  socket.on("joinGame", ({ gameId, username }) => {
    const game = gameManager.joinGame(gameId, socket.id, username);

    if (!game) {
      socket.emit("errorMessage", "Game not found or full");
      return;
    }

    socket.join(game.id);
    broadcastGameState(game);
  });

  // Start game
  socket.on("startGame", ({ gameId }) => {
    const game = gameManager.getGame(gameId);
    if (!game) return;

    game.start();
    broadcastGameState(game);
  });

  // Play card
  socket.on("playCard", ({ gameId, cardId, targetType, targetPlayerId, position }) => {
    const game = gameManager.getGame(gameId);
    if (!game) return;

    const result = game.playCard(socket.id, cardId, targetType, targetPlayerId, position);

    if (!result.success) {
      socket.emit("errorMessage", result.message);
      return;
    }

    broadcastGameState(game);
  });

  socket.on("discardCard", ({ gameId, targetType, targetPlayerId, cardId }) => {
    const game = gameManager.getGame(gameId);
    if (!game) return;

    const result = game.discardCard(socket.id, targetType, targetPlayerId, cardId);

    if (!result.success) {
      socket.emit("errorMessage", result.message);
      return;
    }

    broadcastGameState(game);
  });

  socket.on("skipDiscard", ({ gameId }) => {
    const game = gameManager.getGame(gameId);
    if (!game) return;

    const result = game.skipDiscard(socket.id);

    if (!result.success) {
      socket.emit("errorMessage", result.message);
      return;
    }

    broadcastGameState(game);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    gameManager.removePlayer(socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});