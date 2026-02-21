// game/GameManager.js
const { v4: uuidv4 } = require("uuid");
const Game = require("./Game");

class GameManager {
  constructor() {
    this.games = new Map();
  }

  createGame(playerId, username) {
    const id = uuidv4();
    const game = new Game(id, playerId, username);
    this.games.set(id, game);
    return game;
  }

  joinGame(gameId, playerId, username) {
    const game = Array.from(this.games.values()).find(g => 
      g.id.toLowerCase() === gameId.toLowerCase() || 
      g.id.substring(0, 8).toLowerCase() === gameId.toLowerCase()
    );

    if (!game) return null;
    if (game.players.length >= 5) return null;

    game.addPlayer(playerId, username);
    return game;
  }

  getGame(gameId) {
    return Array.from(this.games.values()).find(g => 
      g.id.toLowerCase() === gameId.toLowerCase() || 
      g.id.substring(0, 8).toLowerCase() === gameId.toLowerCase()
    );
  }

  removePlayer(playerId) {
    for (let game of this.games.values()) {
      game.removePlayer(playerId);
    }
  }
}

module.exports = GameManager;