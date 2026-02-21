<template>
  <div class="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
    <!-- Header -->
    <header class="p-6 bg-slate-900/80 border-b border-slate-800/50 flex justify-between items-center shrink-0 backdrop-blur-xl z-20">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <span class="text-2xl">🏛️</span>
        </div>
        <h1 class="text-2xl font-black text-white tracking-[0.2em]">COURTISANS</h1>
      </div>

      <div class="flex items-center gap-8">
        <div class="flex flex-col items-center">
          <span class="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Current Player</span>
          <div class="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <span class="text-xs font-black text-amber-400 uppercase">
              {{ currentPlayerName }}
            </span>
          </div>
        </div>
        <div class="h-10 w-px bg-slate-800"></div>
        <div class="flex flex-col items-end">
          <span class="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Chamber ID</span>
          <span class="font-mono text-xs text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">{{ store.game.id.substring(0, 8) }}</span>
        </div>
        <div class="h-10 w-px bg-slate-800"></div>
        <button
          @click="store.quitGame()"
          class="flex flex-col items-center group/quit cursor-pointer"
        >
          <span class="text-[9px] text-red-500/50 group-hover/quit:text-red-500 uppercase font-black tracking-widest mb-1 transition-colors">Leave game</span>
          <div class="w-10 h-10 rounded-xl bg-red-500/5 border border-red-500/20 group-hover/quit:bg-red-500 group-hover/quit:border-red-500 flex items-center justify-center transition-all group-hover/quit:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover/quit:scale-110 transition-transform">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
        </button>
      </div>
    </header>

        <!-- Main Game Area -->
        <main class="flex-grow flex flex-col p-6 gap-8 overflow-y-auto relative bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.5)_0%,transparent_100%)]">
          <!-- Winner Overlay -->
          <div v-if="store.game.gameOver" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-1000">
            <div class="flex flex-col items-center gap-10 p-16 bg-slate-900 border border-amber-500/30 rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.2)] animate-in zoom-in duration-700 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>
              <div class="text-8xl animate-bounce drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]">👑</div>
              <div class="text-center relative">
                <p class="text-amber-500/60 uppercase font-black tracking-[0.5em] mb-4 text-xs">The Grand Courtisan</p>
                <h2 class="text-7xl font-black text-white uppercase tracking-tight">
                  {{ winnerName }}
                </h2>
              </div>
              <div class="grid grid-cols-2 gap-4 w-full relative">
                <div v-for="p in sortedPlayers" :key="p.id" class="flex justify-between items-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800 group hover:border-amber-500/30 transition-colors">
                  <span class="text-sm font-bold text-slate-300 group-hover:text-white">{{ p.username }}</span>
                  <span class="text-amber-500 font-mono text-lg font-black">{{ p.score }}</span>
                </div>
              </div>
              <button @click="store.quitGame()" class="relative group">
                <div class="absolute -inset-1 bg-amber-500 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div class="relative px-12 py-4 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-full uppercase transition-all shadow-2xl">
                  Return to Court
                </div>
              </button>
            </div>
          </div>

          <!-- Top Info: Deck & Table -->
          <div class="flex flex-col xl:flex-row gap-8 items-start justify-center">
            <!-- Deck Pile -->
            <div class="flex flex-col items-center gap-3 shrink-0 pt-8">
              <div class="relative w-20 h-32 bg-slate-800 rounded-xl border-2 border-slate-700/50 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all group">
                <!-- Stack Effect -->
                <div class="absolute -right-1.5 -bottom-1.5 w-full h-full bg-slate-800 rounded-xl border-2 border-slate-700/50 -z-10 shadow-lg"></div>
                <div class="absolute -right-3 -bottom-3 w-full h-full bg-slate-800 rounded-xl border-2 border-slate-700/50 -z-20 shadow-md"></div>
                <div class="flex flex-col items-center">
                  <span class="text-3xl font-black text-amber-500 group-hover:scale-110 transition-transform">{{ store.game.deckCount }}</span>
                  <span class="text-[8px] font-black text-slate-500 uppercase mt-1">Cards</span>
                </div>
              </div>
              <span class="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Royal Deck</span>
            </div>

            <!-- Queen's Carpet (River) -->
            <section class="flex-grow flex flex-col items-center gap-6 p-8 bg-slate-900/40 rounded-[2.5rem] border border-slate-800/50 w-full max-w-6xl backdrop-blur-sm relative overflow-hidden shadow-inner">
              <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-5 pointer-events-none"></div>

              <div class="flex items-center gap-4 w-full">
                <div class="h-px bg-slate-800 flex-grow"></div>
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">The Queen's Carpet</h2>
                <div class="h-px bg-slate-800 flex-grow"></div>
              </div>

              <div class="grid grid-cols-7 gap-3 w-full">
                <!-- Family Columns -->
                <div v-for="(data, family) in store.game.table" :key="family" class="flex flex-col gap-3 relative group">
                  <!-- Status Indicator (Game Over only) -->
                  <div v-if="store.game.gameOver && family !== 'Mystery'"
                       class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-2xl z-20 border border-white/10"
                       :class="familyStatusClass(family)">
                    {{ familyStatusLabel(family) }}
                  </div>

                  <!-- Positive Section -->
                  <div class="h-40 bg-slate-950/40 rounded-2xl border border-slate-800/50 p-3 flex flex-col items-center gap-1.5 overflow-y-auto hover:bg-slate-900/50 transition-colors">
                    <span class="text-[10px] font-black text-emerald-500/40 mb-1 leading-none tracking-widest">ESTEEM</span>
                    <div v-for="card in data.positive" :key="card.id"
                      @click="onBoardCardClick('table', null, card)"
                      :class="[
                        'w-full h-10 rounded-lg border shadow-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 transition-all relative card-shine',
                        (family === 'Mystery' && !store.game.gameOver) ? 'bg-slate-800 border-slate-700 text-slate-500' : cardColorClass(card.color),
                        canDiscard(card, 'table', null) ? 'cursor-pointer hover:scale-110 hover:brightness-125 ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900 z-10' : ''
                      ]">
                      {{ (family === 'Mystery' && !store.game.gameOver) ? '?' : card.family.charAt(0) }}
                      <span v-if="!(family === 'Mystery' && !store.game.gameOver)" class="absolute right-1 top-1 text-[8px] drop-shadow-md">
                        {{ roleIcon(card.role) }}
                      </span>
                    </div>
                  </div>

                  <!-- Color Bar -->
                  <div :class="['h-10 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl rounded-xl border border-white/10 relative overflow-hidden group-hover:scale-105 transition-transform', carpetColorClass(family)]">
                    <div class="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                    <span class="relative z-10 drop-shadow-md">{{ family === 'Mystery' ? '???' : family }}</span>
                  </div>

                  <!-- Negative Section -->
                  <div class="h-40 bg-slate-950/40 rounded-2xl border border-slate-800/50 p-3 flex flex-col items-center gap-1.5 overflow-y-auto hover:bg-slate-900/50 transition-colors">
                    <div v-for="card in data.negative" :key="card.id"
                      @click="onBoardCardClick('table', null, card)"
                      :class="[
                        'w-full h-10 rounded-lg border shadow-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 transition-all relative card-shine',
                        (family === 'Mystery' && !store.game.gameOver) ? 'bg-slate-800 border-slate-700 text-slate-500' : cardColorClass(card.color),
                        canDiscard(card, 'table', null) ? 'cursor-pointer hover:scale-110 hover:brightness-125 ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900 z-10' : ''
                      ]">
                      {{ (family === 'Mystery' && !store.game.gameOver) ? '?' : card.family.charAt(0) }}
                      <span v-if="!(family === 'Mystery' && !store.game.gameOver)" class="absolute right-1 top-1 text-[8px] drop-shadow-md">
                        {{ roleIcon(card.role) }}
                      </span>
                    </div>
                    <span class="text-[10px] font-black text-red-500/40 mt-1 leading-none tracking-widest">DISGRACE</span>
                  </div>
                </div>
              </div>
            </section>
          </div>


      <!-- Player Domains -->
      <div class="flex items-center gap-4 w-full">
        <div class="h-px bg-slate-800/50 flex-grow"></div>
        <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Noble Estates</h2>
        <div class="h-px bg-slate-800/50 flex-grow"></div>
      </div>

      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="player in store.game.players"
          :key="player.id"
          :class="[
            'flex flex-col gap-4 p-5 rounded-[2rem] border-2 transition-all relative group',
            player.id === store.game.currentTurn
              ? 'border-amber-500/50 bg-slate-900/80 shadow-[0_20px_50px_rgba(245,158,11,0.15)] ring-4 ring-amber-500/5'
              : 'border-slate-800 bg-slate-900/40 opacity-80 hover:opacity-100 hover:border-slate-700'
          ]"
        >
          <div class="flex justify-between items-center px-2">
            <div class="flex flex-col">
              <span class="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Player</span>
              <span class="font-black text-sm uppercase tracking-tight truncate max-w-[120px] text-white">{{ player.username }}</span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Score</span>
              <span class="text-amber-500 font-mono text-xl font-black drop-shadow-lg">{{ player.score }}</span>
            </div>
          </div>

          <div class="flex-grow flex flex-wrap content-start gap-2 p-4 bg-slate-950/60 rounded-2xl min-h-[140px] border border-slate-800/50 shadow-inner group-hover:bg-slate-950/80 transition-colors">
            <div
              v-for="card in player.domain"
              :key="card.id"
              @click="onBoardCardClick('player', player.id, card)"
              :class="[
                'w-10 h-14 rounded-lg border shadow-xl flex items-center justify-center text-[10px] font-black text-white shrink-0 transition-all relative group/card',
                (card.isMystery && player.id !== store.myId && !store.game.gameOver) ? 'bg-slate-800 border-slate-700 text-slate-500' : cardColorClass(card.color),
                canDiscard(card, 'player', player.id) ? 'cursor-pointer hover:scale-110 hover:brightness-125 ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900 z-10' : ''
              ]"
            >
              <div class="absolute inset-0 bg-white/5 opacity-0 group-hover/card:opacity-100 transition-opacity rounded-lg"></div>
              {{ (card.isMystery && player.id !== store.myId && !store.game.gameOver) ? '?' : card.family.charAt(0) }}
              <span v-if="!((card.isMystery && player.id !== store.myId && !store.game.gameOver))" class="absolute top-1 right-1 text-[8px] drop-shadow-md">
                {{ roleIcon(card.role) }}
              </span>
            </div>
          </div>

          <!-- Turn Indicator -->
          <div v-if="player.id === store.game.currentTurn" class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 rounded-full text-[9px] font-black text-amber-950 uppercase shadow-lg animate-float">
            ACTIVE PLAYER
          </div>
        </div>
      </section>
    </main>

    <!-- Interaction -->
    <footer class="p-6 bg-slate-900/95 border-t border-slate-800 shrink-0 backdrop-blur-xl">
      <div class="max-w-6xl mx-auto">
        <PlayerHand />
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useGameStore } from "../stores/gameStore"
import PlayerHand from "./PlayerHand.vue"

const store = useGameStore()

const currentPlayerName = computed(() => {
  const p = store.game.players.find(p => p.id === store.game.currentTurn)
  return p ? p.username : '...'
})

const isMyTurn = computed(() => store.game.currentTurn === store.myId)
const isPendingAssassin = computed(() => store.game.turnActions.pendingAssassin)
const assassinZone = computed(() => store.game.turnActions.assassinZone)

const winnerName = computed(() => {
  const winner = store.game.players.find(p => p.id === store.game.winnerId)
  return winner ? winner.username : 'Unknown'
})

const sortedPlayers = computed(() => {
  return [...store.game.players].sort((a, b) => b.score - a.score)
})

const roleIcon = (role) => {
  const icons = {
    Noble: '👑',
    Spy: '🎭',
    Assassin: '🗡️',
    Guard: '🛡️',
    Courtesan: '',
  }
  return icons[role] || ''
}

const canDiscard = (card, targetType, targetPlayerId) => {
  if (!isMyTurn.value || !isPendingAssassin.value || card.role === 'Guard') return false;

  const az = assassinZone.value;
  if (!az) return false;

  // Comparison logic matching server
  if (az.targetType === 'table' || az.targetType === 'mystery') {
    return targetType === 'table';
  }
  if (az.targetType === 'self') {
    return targetType === 'player' && targetPlayerId === store.myId;
  }
  if (az.targetType === 'other' || az.targetType === 'other_mystery') {
    return targetType === 'player' && targetPlayerId === az.targetPlayerId;
  }

  return false;
}

const onBoardCardClick = (targetType, targetPlayerId, card) => {
  if (canDiscard(card, targetType, targetPlayerId)) {
    store.discardCard(targetType, targetPlayerId, card.id)
  }
}

const familyStatusLabel = (family) => {
  const status = store.game.familyStatuses?.[family]
  if (status === 1) return 'Esteemed'
  if (status === -1) return 'Disgraced'
  return 'Neutral'
}

const familyStatusClass = (family) => {
  const status = store.game.familyStatuses?.[family]
  if (status === 1) return 'bg-green-600 text-white shadow-green-500/20'
  if (status === -1) return 'bg-red-600 text-white shadow-red-500/20'
  return 'bg-slate-700 text-slate-300'
}

const cardColorClass = (color) => {
  const colors = {
    red: 'bg-gradient-to-br from-red-700 to-red-950 border-red-500/30 shadow-red-950/50',
    blue: 'bg-gradient-to-br from-blue-700 to-blue-950 border-blue-500/30 shadow-blue-950/50',
    green: 'bg-gradient-to-br from-emerald-700 to-emerald-950 border-emerald-500/30 shadow-emerald-950/50',
    yellow: 'bg-gradient-to-br from-amber-600 to-amber-900 border-amber-400/30 shadow-amber-900/50',
    purple: 'bg-gradient-to-br from-purple-700 to-purple-950 border-purple-500/30 shadow-purple-950/50',
    orange: 'bg-gradient-to-br from-orange-600 to-orange-950 border-orange-500/30 shadow-orange-950/50',
  }
  return colors[color] || 'bg-slate-700'
}

const carpetColorClass = (family) => {
  const colors = {
    "Lion": "bg-red-600 border-red-400/30",
    "Fish": "bg-blue-600 border-blue-400/30",
    "Bird": "bg-emerald-600 border-emerald-400/30",
    "Sun": "bg-amber-500 border-amber-300/30",
    "Moon": "bg-purple-600 border-purple-400/30",
    "Star": "bg-orange-600 border-orange-400/30",
    "Mystery": "bg-slate-800 border-slate-600/30 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"
  }
  return colors[family] || 'bg-slate-600'
}
</script>
