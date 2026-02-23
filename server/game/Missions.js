const Missions = [
  // --- Tangaouis (Purple/Maritime) ---
  {
    id: 1,
    name: "Northern Supremacy",
    description: "Have more Tangaouis cards in your domain than any other player.",
    points: 3,
    check: (player, allPlayers) => {
      const myCount = player.domain.filter(c => c.family === "Tangaouis").length;
      if (myCount === 0) return false;
      return allPlayers.every(p => p.id === player.id || p.domain.filter(c => c.family === "Tangaouis").length < myCount);
    }
  },
  {
    id: 2,
    name: "Port of Influence",
    description: "Ensure Tangaouis are Esteemed at the end of the game.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => tableStatuses["Tangaouis"] === 1
  },
  {
    id: 3,
    name: "Maritime Trade",
    description: "Have at least 2 Tangaouis and 1 Noble in your domain.",
    points: 3,
    check: (player) => {
      const tangaouis = player.domain.filter(c => c.family === "Tangaouis").length;
      const nobles = player.domain.filter(c => c.role === "Noble").length;
      return tangaouis >= 2 && nobles >= 1;
    }
  },

  // --- Sahraouis (Yellow/Desert) ---
  {
    id: 4,
    name: "Desert Dominance",
    description: "Have at least 4 Sahraouis cards in your domain.",
    points: 3,
    check: (player) => player.domain.filter(c => c.family === "Sahraouis").length >= 4
  },
  {
    id: 5,
    name: "Oasis Protection",
    description: "Have at least 1 Sahraouis and 2 Guards in your domain.",
    points: 3,
    check: (player) => {
      const sahraouis = player.domain.some(c => c.family === "Sahraouis");
      const guards = player.domain.filter(c => c.role === "Guard").length;
      return sahraouis && guards >= 2;
    }
  },
  {
    id: 6,
    name: "Sandstorm",
    description: "Make sure at least one opponent has no Sahraouis in their domain.",
    points: 3,
    check: (player, allPlayers) => {
      return allPlayers.some(p => p.id !== player.id && p.domain.filter(c => c.family === "Sahraouis").length === 0);
    }
  },

  // --- Rifis (Green/Mountain) ---
  {
    id: 7,
    name: "Mountain Bastion",
    description: "Have at least 3 Rifis cards in your domain.",
    points: 3,
    check: (player) => player.domain.filter(c => c.family === "Rifis").length >= 3
  },
  {
    id: 8,
    name: "Unbreakable North",
    description: "Have both Rifis and Tangaouis in your domain, with more Rifis than Tangaouis.",
    points: 3,
    check: (player) => {
      const rifis = player.domain.filter(c => c.family === "Rifis").length;
      const tangaouis = player.domain.filter(c => c.family === "Tangaouis").length;
      return rifis > tangaouis && tangaouis > 0;
    }
  },
  {
    id: 9,
    name: "Resistance",
    description: "Ensure Rifis are NOT Disgraced at game end.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => tableStatuses["Rifis"] !== -1
  },

  // --- Rbatis (Blue/Capital) ---
  {
    id: 10,
    name: "Capital Control",
    description: "Have cards from at least 4 different families in your domain.",
    points: 3,
    check: (player) => new Set(player.domain.map(c => c.family)).size >= 4
  },
  {
    id: 11,
    name: "Royal Influence",
    description: "Have Rbatis in the highest Favor position on the Carpet.",
    points: 3,
    check: (player, allPlayers, tableStatuses, table) => {
      const getDiff = (fam) => (table[fam]?.positive?.length || 0) - (table[fam]?.negative?.length || 0);
      const rbatisDiff = getDiff("Rbatis");
      const families = ["Marrakchis", "Rifis", "Sahraouis", "Tangaouis", "Chleuhs"];
      return families.every(fam => getDiff(fam) < rbatisDiff);
    }
  },
  {
    id: 12,
    name: "Political Web",
    description: "Have more Rbatis than Marrakchis in your domain.",
    points: 3,
    check: (player) => {
      const rbatis = player.domain.filter(c => c.family === "Rbatis").length;
      const marrakchis = player.domain.filter(c => c.family === "Marrakchis").length;
      return rbatis > marrakchis;
    }
  },

  // --- Marrakchis (Red/Market) ---
  {
    id: 13,
    name: "Red City Prestige",
    description: "Have at least 3 Marrakchis cards and 1 Noble in your domain.",
    points: 3,
    check: (player) => {
      const marrakchis = player.domain.filter(c => c.family === "Marrakchis").length;
      const nobles = player.domain.filter(c => c.role === "Noble").length;
      return marrakchis >= 3 && nobles >= 1;
    }
  },
  {
    id: 14,
    name: "Market Manipulator",
    description: "Have Marrakchis Esteemed and Sahraouis Disgraced.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => tableStatuses["Marrakchis"] === 1 && tableStatuses["Sahraouis"] === -1
  },
  {
    id: 15,
    name: "Court Intrigue",
    description: "Have at least 2 Marrakchis and 2 Rbatis in your domain.",
    points: 3,
    check: (player) => {
      const marrakchis = player.domain.filter(c => c.family === "Marrakchis").length;
      const rbatis = player.domain.filter(c => c.family === "Rbatis").length;
      return marrakchis >= 2 && rbatis >= 2;
    }
  },

  // --- Chleuhs (Olive/Traders) ---
  {
    id: 16,
    name: "Souss Strategy",
    description: "Have at least 3 Chleuhs cards in your domain.",
    points: 3,
    check: (player) => player.domain.filter(c => c.family === "Chleuhs").length >= 3
  },
  {
    id: 17,
    name: "Mountain Alliance",
    description: "Have both Chleuhs and Rifis in your domain, with an equal number of each.",
    points: 3,
    check: (player) => {
      const chleuhs = player.domain.filter(c => c.family === "Chleuhs").length;
      const rifis = player.domain.filter(c => c.family === "Rifis").length;
      return chleuhs > 0 && chleuhs === rifis;
    }
  },
  {
    id: 18,
    name: "Silent Traders",
    description: "Have Chleuhs Esteemed while Tangaouis are NOT.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => tableStatuses["Chleuhs"] === 1 && tableStatuses["Tangaouis"] !== 1
  },

  // --- Advanced / General ---
  {
    id: 19,
    name: "Royal Balance",
    description: "Have at least 1 card of each of the 6 families in your domain.",
    points: 4,
    check: (player) => new Set(player.domain.map(c => c.family)).size === 6
  },
  {
    id: 20,
    name: "Iron Wall",
    description: "Have at least 3 Guard cards in your domain.",
    points: 3,
    check: (player) => player.domain.filter(c => c.role === "Guard").length >= 3
  }
];

module.exports = Missions;
