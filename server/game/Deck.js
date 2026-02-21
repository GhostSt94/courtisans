// game/Deck.js
class Deck {
  constructor() {
    this.families = [
      { name: "Lion", color: "red" },
      { name: "Fish", color: "blue" },
      { name: "Bird", color: "green" },
      { name: "Sun", color: "yellow" },
      { name: "Moon", color: "purple" },
      { name: "Star", color: "orange" }
    ];
    this.cards = this.generateDeck();
    this.shuffle();
  }

  generateDeck() {
    const cards = [];
    let id = 1;
    this.families.forEach(family => {
      // 15 cards per family breakdown:
      // 4 Nobles (x2 score)
      for (let i = 0; i < 4; i++) cards.push(this.createCard(id++, family, "Noble"));
      // 2 Spies (Must be played mysteriously)
      for (let i = 0; i < 2; i++) cards.push(this.createCard(id++, family, "Spy"));
      // 2 Assassins (Discard a card)
      for (let i = 0; i < 2; i++) cards.push(this.createCard(id++, family, "Assassin"));
      // 3 Guards (Protect from Assassins)
      for (let i = 0; i < 3; i++) cards.push(this.createCard(id++, family, "Guard"));
      // 4 Courtesans (Standard)
      for (let i = 0; i < 4; i++) cards.push(this.createCard(id++, family, "Courtesan"));
    });
    return cards;
  }

  createCard(id, family, role) {
    return {
      id,
      family: family.name,
      color: family.color,
      role: role,
      value: role === "Noble" ? 2 : 1
    };
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  limitTo(count) {
    if (count < this.cards.length) {
      this.cards = this.cards.slice(0, count);
    }
  }

  draw() {
    return this.cards.pop();
  }
}

module.exports = Deck;
