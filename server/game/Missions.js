const Missions = [
  {
    id: 1,
    name: "Northern Supremacy",
    description: "Have more Tangaouis cards than any other player.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => {
      const myCount = player.domain.filter(c => c.family === "Tangaouis").length;
      return allPlayers.every(p => p.id === player.id || p.domain.filter(c => c.family === "Tangaouis").length < myCount);
    }
  },
  {
    id: 2,
    name: "Port of Influence",
    description: "Ensure Tangaouis are in the Queen's Favor at the end.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => tableStatuses["Tangaouis"] === 1
  },
  {
    id: 3,
    name: "Maritime Alliance",
    description: "Have at least 2 Tangaouis and 2 Rbatis in your domain.",
    points: 3,
    check: (player) => {
      const tangaouis = player.domain.filter(c => c.family === "Tangaouis").length;
      const rbatis = player.domain.filter(c => c.family === "Rbatis").length;
      return tangaouis >= 2 && rbatis >= 2;
    }
  },
  {
    id: 4,
    name: "Desert Dominance",
    description: "Have at least 4 Sahraouis cards.",
    points: 3,
    check: (player) => player.domain.filter(c => c.family === "Sahraouis").length >= 4
  },
  {
    id: 5,
    name: "Sandstorm",
    description: "Make sure at least one opponent has no Sahraouis.",
    points: 3,
    check: (player, allPlayers) => {
      return allPlayers.some(p => p.id !== player.id && p.domain.filter(c => c.family === "Sahraouis").length === 0);
    }
  },
  {
    id: 6,
    name: "Endurance of the Dunes",
    description: "Have Sahraouis in Favor while Rifis are in Disgrace.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => tableStatuses["Sahraouis"] === 1 && tableStatuses["Rifis"] === -1
  },
  {
    id: 7,
    name: "Mountain Pride",
    description: "Have exactly 3 Rifis cards.",
    points: 3,
    check: (player) => player.domain.filter(c => c.family === "Rifis").length === 3
  },
  {
    id: 8,
    name: "Unbreakable North",
    description: "Have Rifis and Tangaouis both in your domain, but more Rifis.",
    points: 3,
    check: (player) => {
      const rifis = player.domain.filter(c => c.family === "Rifis").length;
      const tangaouis = player.domain.filter(c => c.family === "Tangaouis").length;
      return rifis > 0 && tangaouis > 0 && rifis > tangaouis;
    }
  },
  {
    id: 9,
    name: "Resistance",
    description: "Ensure Rifis are not in Disgrace at game end.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => tableStatuses["Rifis"] !== -1
  },
  {
    id: 10,
    name: "Capital Control",
    description: "Have at least 1 card of 4 different families (political balance).",
    points: 3,
    check: (player) => {
      const families = new Set(player.domain.map(c => c.family));
      return families.size >= 4;
    }
  },
  {
    id: 11,
    name: "Royal Influence",
    description: "Have Rbatis in the highest Favor position.",
    points: 3,
    check: (player, allPlayers, tableStatuses, table) => {
      const getDiff = (fam) => table[fam].positive.length - table[fam].negative.length;
      const rbatisDiff = getDiff("Rbatis");
      for (const fam in table) {
        if (fam !== "Mystery" && fam !== "Rbatis" && getDiff(fam) >= rbatisDiff) return false;
      }
      return true;
    }
  },
  {
    id: 12,
    name: "Political Web",
    description: "Have more Rbatis than Marrakchis.",
    points: 3,
    check: (player) => {
      const rbatis = player.domain.filter(c => c.family === "Rbatis").length;
      const marrakchis = player.domain.filter(c => c.family === "Marrakchis").length;
      return rbatis > marrakchis;
    }
  },
  {
    id: 13,
    name: "Red City Prestige",
    description: "Have at least 4 Marrakchis.",
    points: 3,
    check: (player) => player.domain.filter(c => c.family === "Marrakchis").length >= 4
  },
  {
    id: 14,
    name: "Market Manipulator",
    description: "Have Marrakchis in Favor and Sahraouis in Disgrace.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => tableStatuses["Marrakchis"] === 1 && tableStatuses["Sahraouis"] === -1
  },
  {
    id: 15,
    name: "Court Intrigue",
    description: "Have exactly 2 Marrakchis and 2 Rbatis.",
    points: 3,
    check: (player) => {
      const marrakchis = player.domain.filter(c => c.family === "Marrakchis").length;
      const rbatis = player.domain.filter(c => c.family === "Rbatis").length;
      return marrakchis === 2 && rbatis === 2;
    }
  },
  {
    id: 16,
    name: "Souss Strategy",
    description: "Have exactly 3 Chleuhs.",
    points: 3,
    check: (player) => player.domain.filter(c => c.family === "Chleuhs").length === 3
  },
  {
    id: 17,
    name: "Mountain Alliance",
    description: "Have both Chleuhs and Rifis, with equal numbers.",
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
    description: "Have Chleuhs in Favor while Tangaouis are not.",
    points: 3,
    check: (player, allPlayers, tableStatuses) => tableStatuses["Chleuhs"] === 1 && tableStatuses["Tangaouis"] !== 1
  },
  {
    id: 19,
    name: "Royal Balance",
    points: 4,
    description: "Have exactly 1 card of each family.",
    check: (player) => {
      const families = ["Marrakchis", "Rbatis", "Rifis", "Sahraouis", "Tangaouis", "Chleuhs"];
      return families.every(f => player.domain.filter(c => c.family === f).length === 1);
    }
  },
  {
    id: 20,
    name: "Northern Empire",
    points: 4,
    description: "Have Tangaouis + Rifis + Rbatis all in your domain and none in Disgrace.",
    check: (player, allPlayers, tableStatuses) => {
      const families = ["Tangaouis", "Rifis", "Rbatis"];
      const hasAll = families.every(f => player.domain.some(c => c.family === f));
      const noneInDisgrace = families.every(f => tableStatuses[f] !== -1);
      return hasAll && noneInDisgrace;
    }
  }
];

module.exports = Missions;
