// game/Game.js
const Deck = require("./Deck");
const Missions = require("./Missions");

class Game {
  constructor(id, hostId, userId, hostUsername) {
    this.id = id;
    this.hostId = hostId;
    this.players = [];
    this.currentTurnIndex = 0;
    this.started = false;
    this.deck = null;

    // The Carpet / River structure
    this.table = {
      "Marrakchis": { positive: [], negative: [] },
      "Rbatis": { positive: [], negative: [] },
      "Rifis": { positive: [], negative: [] },
      "Sahraouis": { positive: [], negative: [] },
      "Tangaouis": { positive: [], negative: [] },
      "Chleuhs": { positive: [], negative: [] },
      "Mystery": { positive: [], negative: [] }
    };

    this.turnState = {
      drawnCards: [],
      playedSelf: false,
      playedOther: false,
      playedTable: false,
    };

    this.revealing = false;
    this.onUpdate = null;
    this.addPlayer(hostId, userId, hostUsername);
  }

  addPlayer(socketId, userId, username) {
    if (this.started) return;
    this.players.push({
      id: socketId,
      userId: userId,
      username: username || `Player ${this.players.length + 1}`,
      domain: [], // Space in front where players play cards
      missions: [], // Mission cards
      score: 0,
    });
  }

  updatePlayerSocket(userId, newSocketId) {
    const player = this.players.find(p => p.userId === userId);
    if (player) {
      player.id = newSocketId;
      return true;
    }
    return false;
  }

  removePlayerByUserId(userId) {
    this.players = this.players.filter(p => p.userId !== userId);
  }

  removePlayerBySocketId(socketId) {
    this.players = this.players.filter(p => p.id !== socketId);
  }

  start() {
    if (this.players.length < 2) return;

    this.started = true;
    this.deck = new Deck();

    // Mission Deck
    const missionDeck = [...Missions];
    // Shuffle missionDeck
    for (let i = missionDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [missionDeck[i], missionDeck[j]] = [missionDeck[j], missionDeck[i]];
    }

    // Deal 2 missions to each player
    this.players.forEach(player => {
      player.missions = [missionDeck.pop(), missionDeck.pop()];
    });

    // Scale deck based on player count
    const deckSizes = { 2: 60, 3: 72, 4: 84, 5: 90 };
    const size = deckSizes[this.players.length] || 90;
    this.deck.limitTo(size);

    this.startPlayerTurn();
  }

  startPlayerTurn() {
    // Current player draws 3 cards from the deck
    this.turnState = {
      drawnCards: [this.deck.draw(), this.deck.draw(), this.deck.draw()],
      playedSelf: false,
      playedOther: false,
      playedTable: false,
      pendingAssassin: false,
      assassinZone: null,
    };
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  canDiscardAny(targetType, targetPlayerId, excludeCardId) {
    if (targetType === 'table' || targetType === 'mystery') {
      for (const fam in this.table) {
        for (const pos of ['positive', 'negative']) {
          if (this.table[fam][pos].some(c => c.id !== excludeCardId && c.role !== 'Guard')) {
            return true;
          }
        }
      }
    } else {
      let actualPlayerId = (targetType === 'self') ? this.getCurrentPlayer().id : targetPlayerId;
      const player = this.players.find(p => p.id === actualPlayerId);
      if (player && player.domain.some(c => c.id !== excludeCardId && c.role !== 'Guard')) {
        return true;
      }
    }
    return false;
  }

  playCard(playerId, cardId, targetType, targetPlayerId, position) {
    if (!this.started) return { success: false, message: "Game not started" };

    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId) return { success: false, message: "Not your turn" };

    const cardIndex = this.turnState.drawnCards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return { success: false, message: "Card not in hand" };

        const card = this.turnState.drawnCards[cardIndex];

        const isMysteryTarget = (targetType === 'mystery' || targetType === 'other_mystery' || (targetType === 'self' && card.role === 'Spy'));

        // Role-specific validations
        if (card.role === "Spy") {
          // Spies MUST be played to a mystery target (domain or table)
          if (!isMysteryTarget) {
            return { success: false, message: "Spies must be played mysteriously" };
          }
        } else {
          // NON-Spies CANNOT be played mysteriously
          if (isMysteryTarget) {
            return { success: false, message: "Only Spies can be played mysteriously" };
          }
        }

            if (targetType === 'self') {
              if (this.turnState.playedSelf) return { success: false, message: "Already played for yourself" };
              currentPlayer.domain.push({ ...card, isMystery: card.role === 'Spy' });
              this.turnState.playedSelf = true;
            }
            else if (targetType === 'other') {
              if (this.turnState.playedOther) return { success: false, message: "Already played for an opponent" };
              const opponent = this.players.find(p => p.id === targetPlayerId);
              if (!opponent || opponent.id === playerId) return { success: false, message: "Invalid opponent" };
              opponent.domain.push({ ...card, isMystery: false });
              this.turnState.playedOther = true;
            }
            else if (targetType === 'other_mystery') {
              // Spy or other cards played mysteriously to an opponent
              if (this.turnState.playedOther) return { success: false, message: "Already played for an opponent" };
              const opponent = this.players.find(p => p.id === targetPlayerId);
              if (!opponent || opponent.id === playerId) return { success: false, message: "Invalid opponent" };
              opponent.domain.push({ ...card, isMystery: true });
              this.turnState.playedOther = true;
            }
            else if (targetType === 'table') {
              if (this.turnState.playedTable) return { success: false, message: "Already played on table" };
              if (!position || !['positive', 'negative'].includes(position)) return { success: false, message: "Invalid table position" };

              const family = card.family;
              this.table[family][position].push({ ...card, isMystery: false });
              this.turnState.playedTable = true;
            }
            else if (targetType === 'mystery') {
              if (this.turnState.playedTable) return { success: false, message: "Already played on table" };
              if (!position || !['positive', 'negative'].includes(position)) return { success: false, message: "Invalid table position" };

              this.table["Mystery"][position].push({ ...card, isMystery: true });
              this.turnState.playedTable = true;
            }
                        else {
                          return { success: false, message: "Invalid target type" };
                        }

                        // Handle Assassin discard logic if it was an Assassin
                        if (card.role === "Assassin") {
                          if (this.canDiscardAny(targetType, targetPlayerId, card.id)) {
                            this.turnState.pendingAssassin = true;
                            this.turnState.assassinZone = { targetType, targetPlayerId, playedCardId: card.id };
                          } else {
                            this.turnState.pendingAssassin = false;
                          }
                        }

                        this.turnState.drawnCards.splice(cardIndex, 1);
                        if (this.turnState.drawnCards.length === 0 && !this.turnState.pendingAssassin) this.nextTurn();
                        return { success: true };
                      }

                      discardCard(playerId, targetType, targetPlayerId, cardId) {
                        if (!this.turnState.pendingAssassin) return { success: false, message: "No assassin played" };

                        const currentPlayer = this.getCurrentPlayer();
                        if (currentPlayer.id !== playerId) return { success: false, message: "Not your turn" };

                        // Validate Zone
                        const az = this.turnState.assassinZone;

                        if (cardId === az.playedCardId) return { success: false, message: "Cannot discard the Assassin you just played" };

                        // Map 'mystery' to 'table' and 'other_mystery' to 'player' for zone comparison
                        const zoneMatch = (az.targetType === 'table' || az.targetType === 'mystery') ? (targetType === 'table') :
                                         (az.targetType === 'self') ? (targetType === 'player' && targetPlayerId === playerId) :
                                         (az.targetType === 'other' || az.targetType === 'other_mystery') ? (targetType === 'player' && targetPlayerId === az.targetPlayerId) : false;

                        if (!zoneMatch) return { success: false, message: "Must discard from the same zone where Assassin was played" };

                        if (targetType === 'table') {
                          for (const fam in this.table) {
                            for (const pos of ['positive', 'negative']) {
                              const idx = this.table[fam][pos].findIndex(c => c.id === cardId);
                              if (idx !== -1) {
                                if (this.table[fam][pos][idx].role === 'Guard') return { success: false, message: "Cannot discard a Guard" };
                                this.table[fam][pos].splice(idx, 1);
                                this.turnState.pendingAssassin = false;
                                if (this.turnState.drawnCards.length === 0) this.nextTurn();
                                return { success: true };
                              }
                            }
                          }
                        } else if (targetType === 'player') {
                          const player = this.players.find(p => p.id === targetPlayerId);
                          if (!player) return { success: false, message: "Player not found" };
                          const idx = player.domain.findIndex(c => c.id === cardId);
                          if (idx !== -1) {
                            if (player.domain[idx].role === 'Guard') return { success: false, message: "Cannot discard a Guard" };
                            player.domain.splice(idx, 1);
                            this.turnState.pendingAssassin = false;
                            if (this.turnState.drawnCards.length === 0) this.nextTurn();
                            return { success: true };
                          }
                        }

                        return { success: false, message: "Target card not found" };
                      }

                      skipDiscard(playerId) {
                        if (!this.turnState.pendingAssassin) return { success: false, message: "No assassin played" };

                        const currentPlayer = this.getCurrentPlayer();
                        if (currentPlayer.id !== playerId) return { success: false, message: "Not your turn" };

                        this.turnState.pendingAssassin = false;
                        if (this.turnState.drawnCards.length === 0) this.nextTurn();
                        return { success: true };
                      }

                      nextTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    // Check if game should end
    if (this.deck.cards.length === 0) {
      this.revealTable();
    } else {
      this.startPlayerTurn();
    }
  }

  revealTable() {
    this.revealing = true;

    // 1. Reveal and move Mystery Table cards to their respective families
    ['positive', 'negative'].forEach(pos => {
      this.table.Mystery[pos].forEach(card => {
        const family = card.family;
        this.table[family][pos].push({ ...card, isMystery: false });
      });
      this.table.Mystery[pos] = [];
    });

    // 2. Reveal player mystery cards (Spies)
    this.players.forEach(p => {
      p.domain.forEach(c => c.isMystery = false);
    });

    // Wait for animation delay then calculate final scores
    setTimeout(() => {
      this.calculateScores();
      if (this.onUpdate) this.onUpdate();
    }, 3000); // 3 seconds for client to animate/show reveal
  }

  calculateScores() {
    this.gameOver = true;
    this.started = false;
    this.revealing = false;

    // 2. Determine family statuses (Esteemed/Disgraced)
    const familyStatuses = {};
    const families = ["Marrakchis", "Rbatis", "Rifis", "Sahraouis", "Tangaouis", "Chleuhs"];

    families.forEach(name => {
      const posCount = this.table[name].positive.length;
      const negCount = this.table[name].negative.length;

      if (posCount > negCount) familyStatuses[name] = 1; // Esteemed
      else if (posCount < negCount) familyStatuses[name] = -1; // Disgraced
      else familyStatuses[name] = 0; // Neutral
    });

    this.familyStatuses = familyStatuses;

    // 3. Tally player scores
    this.players.forEach(player => {
      let score = 0;
      // Domain cards
      player.domain.forEach(card => {
        const status = familyStatuses[card.family] || 0;
        const weight = card.role === "Noble" ? 2 : 1;
        score += status * weight;
      });

      // Missions
      player.missions.forEach(mission => {
        if (mission.check(player, this.players, familyStatuses, this.table)) {
          mission.completed = true;
          score += mission.points;
        } else {
          mission.completed = false;
        }
      });

      player.score = score;
    });

    // 4. Find Winner
    const sorted = [...this.players].sort((a, b) => b.score - a.score);
    this.winnerId = sorted[0].id;
  }

  getPublicState() {
    return {
      id: this.id,
      hostId: this.hostId,
      players: this.players.map(p => ({
        id: p.id,
        username: p.username,
        domain: p.domain,
        score: p.score,
      })),
      table: this.table,
      currentTurn: this.getCurrentPlayer()?.id,
      started: this.started,
      gameOver: this.gameOver || false,
      winnerId: this.winnerId || null,
      familyStatuses: this.familyStatuses || null,
      deckCount: this.deck ? this.deck.cards.length : 0,
      revealing: this.revealing,
      turnActions: {
        playedSelf: this.turnState.playedSelf,
        playedOther: this.turnState.playedOther,
        playedTable: this.turnState.playedTable,
        pendingAssassin: this.turnState.pendingAssassin,
        assassinZone: this.turnState.assassinZone,
      }
    };
  }

  getStateForPlayer(playerId) {
    const isMyTurn = this.getCurrentPlayer()?.id === playerId;
    const publicState = this.getPublicState();

    // Obfuscate mystery cards in players' domains for others ONLY if not game over
    const players = publicState.players.map(p => {
      const isMe = p.id === playerId;
      return {
        ...p,
        missions: (isMe || publicState.gameOver) ? this.players.find(realP => realP.id === p.id).missions : [],
        domain: p.domain.map(card => {
          if (card.isMystery && !isMe && !publicState.gameOver) {
            return { id: card.id, isMystery: true }; // Hide details
          }
          return card;
        })
      };
    });

    return {
      ...publicState,
      players,
      myHand: (isMyTurn && !publicState.gameOver) ? this.turnState.drawnCards : [],
    };
  }
}

module.exports = Game;
