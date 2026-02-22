// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const GameManager = require("./game/GameManager");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
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
  socket.on("createGame", ({ userId, username }) => {
    const game = gameManager.createGame(socket.id, userId, username);
    socket.join(game.id);
    socket.emit("gameUpdated", game.getStateForPlayer(socket.id));
  });

  // Join game
  socket.on("joinGame", ({ gameId, userId, username }) => {
    const game = gameManager.joinGame(gameId, socket.id, userId, username);

    if (!game) {
      socket.emit("errorMessage", "Game not found or full");
      return;
    }

    socket.join(game.id);
    broadcastGameState(game);
  });

  // Reconnect to game
  socket.on("reconnectGame", ({ gameId, userId }) => {
    const game = gameManager.getGame(gameId);
    if (game && game.updatePlayerSocket(userId, socket.id)) {
      socket.join(game.id);
      socket.emit("gameUpdated", game.getStateForPlayer(socket.id));
      broadcastGameState(game);
    } else {
      socket.emit("errorMessage", "Could not reconnect to game");
      socket.emit("gameUpdated", null);
      // Clear game from localStorage if reconnection failed
    }
  });

  // Quit game
  socket.on("quitGame", ({ gameId, userId }) => {
    if (gameManager.quitGame(gameId, userId)) {
      const game = gameManager.getGame(gameId);
      if (game) {
        broadcastGameState(game);
      }
      socket.leave(gameId);
      socket.emit("gameUpdated", null);
    }
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
  });
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
