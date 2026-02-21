// game/GameManager.js
const { v4: uuidv4 } = require("uuid");
const Game = require("./Game");

class GameManager {
  constructor() {
    this.games = new Map();
  }

  createGame(socketId, userId, username) {
    const id = uuidv4();
    const game = new Game(id, socketId, userId, username);
    this.games.set(id, game);
    return game;
  }

  joinGame(gameId, socketId, userId, username) {
    const game = this.getGame(gameId);

    if (!game) return null;
    if (game.players.length >= 5) return null;

    game.addPlayer(socketId, userId, username);
    return game;
  }

  getGame(gameId) {
    return Array.from(this.games.values()).find(g => 
      g.id.toLowerCase() === gameId.toLowerCase() || 
      g.id.substring(0, 8).toLowerCase() === gameId.toLowerCase()
    );
  }

  getGameByUserId(userId) {
    return Array.from(this.games.values()).find(game => 
      game.players.some(p => p.userId === userId)
    );
  }

  removePlayerBySocketId(socketId) {
    for (let game of this.games.values()) {
      game.removePlayerBySocketId(socketId);
    }
  }

  quitGame(gameId, userId) {
    const game = this.getGame(gameId);
    if (game) {
      game.removePlayerByUserId(userId);
      // If no players left, remove the game
      if (game.players.length === 0) {
        this.games.delete(game.id);
      }
      return true;
    }
    return false;
  }
}

module.exports = GameManager;