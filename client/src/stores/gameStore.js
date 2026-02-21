import { defineStore } from "pinia"
import { socket } from "../socket"

export const useGameStore = defineStore("game", {
  state: () => ({
    game: null,
    myId: null,
    userId: localStorage.getItem('courtisans_userId') || (() => {
      const id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('courtisans_userId', id);
      return id;
    })(),
    username: localStorage.getItem('courtisans_username') || "",
    error: null
  }),

  actions: {
    init() {
      if (socket.connected) {
        this.myId = socket.id
        this.checkReconnection()
      }

      socket.on("connect", () => {
        this.myId = socket.id
        this.checkReconnection()
      })

      socket.on("gameUpdated", (game) => {
        this.game = game
        if (game) {
          localStorage.setItem('courtisans_gameId', game.id)
        } else {
          localStorage.removeItem('courtisans_gameId')
        }
      })

      socket.on("errorMessage", (msg) => {
        this.error = msg
        setTimeout(() => this.error = null, 3000)
      })
    },

    checkReconnection() {
      const savedGameId = localStorage.getItem('courtisans_gameId')
      if (savedGameId && !this.game) {
        this.reconnectGame(savedGameId)
      }
    },

    createGame(username) {
      this.username = username
      localStorage.setItem('courtisans_username', username)
      socket.emit("createGame", { userId: this.userId, username })
    },

    joinGame(gameId, username) {
      this.username = username
      localStorage.setItem('courtisans_username', username)
      socket.emit("joinGame", { gameId, userId: this.userId, username })
    },

    reconnectGame(gameId) {
      socket.emit("reconnectGame", { gameId, userId: this.userId })
    },

    quitGame() {
      if (this.game) {
        socket.emit("quitGame", { gameId: this.game.id, userId: this.userId })
      }
      this.game = null
      localStorage.removeItem('courtisans_gameId')
    },

    startGame() {
      socket.emit("startGame", { gameId: this.game.id })
    },

    playCard(cardId, targetType, targetPlayerId = null, position = null) {
      socket.emit("playCard", {
        gameId: this.game.id,
        cardId,
        targetType,
                        targetPlayerId,
                        position
                      })
                    },
                
                    discardCard(targetType, targetPlayerId, cardId) {
                      socket.emit("discardCard", {
                        gameId: this.game.id,
                        targetType,
                        targetPlayerId,
                        cardId
                      })
                    },
                
                    skipDiscard() {
                      socket.emit("skipDiscard", {
                        gameId: this.game.id
                      })
                    }
                  }
                })
                