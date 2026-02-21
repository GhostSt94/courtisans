import { defineStore } from "pinia"
import { socket } from "../socket"

export const useGameStore = defineStore("game", {
  state: () => ({
    game: null,
    myId: null,
    username: localStorage.getItem('courtisans_username') || "",
    error: null
  }),

  actions: {
    init() {
      if (socket.connected) {
        this.myId = socket.id
      }

      socket.on("connect", () => {
        this.myId = socket.id
      })

      socket.on("gameUpdated", (game) => {
        this.game = game
      })

      socket.on("errorMessage", (msg) => {
        this.error = msg
        setTimeout(() => this.error = null, 3000)
      })
    },

    createGame(username) {
      this.username = username
      localStorage.setItem('courtisans_username', username)
      socket.emit("createGame", { username })
    },

    joinGame(gameId, username) {
      this.username = username
      localStorage.setItem('courtisans_username', username)
      socket.emit("joinGame", { gameId, username })
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
                