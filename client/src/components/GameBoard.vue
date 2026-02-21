<template>
  <div class="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
    <!-- Header -->
    <header class="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
      <h1 class="text-xl font-bold text-amber-500 tracking-tighter">COURTISANS</h1>
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center">
          <span class="text-[10px] text-slate-500 uppercase font-black">Turn of</span>
          <span class="text-sm font-bold text-amber-400">
            {{ currentPlayerName }}
          </span>
        </div>
        <div class="h-8 w-px bg-slate-800"></div>
        <div class="flex flex-col items-end text-[10px]">
          <span class="text-slate-500 uppercase font-black">Game ID</span>
          <span class="font-mono text-slate-400">{{ store.game.id.substring(0, 8) }}</span>
        </div>
      </div>
    </header>

        <!-- Main Game Area -->
        <main class="flex-grow flex flex-col p-4 gap-6 overflow-y-auto relative">
          <!-- Winner Overlay -->
          <div v-if="store.game.gameOver" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-lg animate-in fade-in duration-1000">
            <div class="flex flex-col items-center gap-8 p-12 bg-slate-900 border-2 border-amber-500 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-in zoom-in duration-700">
              <div class="text-6xl animate-bounce">👑</div>
              <div class="text-center">
                <p class="text-slate-500 uppercase font-black tracking-widest mb-2">Grand Courtisan</p>
                <h2 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 uppercase">
                  {{ winnerName }}
                </h2>
              </div>
              <div class="grid grid-cols-2 gap-4 w-full">
                <div v-for="p in sortedPlayers" :key="p.id" class="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                  <span class="text-xs font-bold">{{ p.username }}</span>
                  <span class="text-amber-500 font-mono font-black">{{ p.score }}</span>
                </div>
              </div>
              <button @click="location.reload()" class="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-full uppercase transition-all transform hover:scale-105">
                Back to Lobby
              </button>
            </div>
          </div>
    
          <!-- Top Info: Deck & Table -->
          <div class="flex flex-col md:flex-row gap-6 items-center justify-center">
            <!-- Deck Pile -->
            <div class="flex flex-col items-center gap-2 group">
              <div class="relative w-16 h-24 bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center shadow-xl transform group-hover:-rotate-3 transition-transform">
                <!-- Stack Effect -->
                <div class="absolute -right-1 -bottom-1 w-full h-full bg-slate-800 rounded-lg border-2 border-slate-700 -z-10"></div>
                <div class="absolute -right-2 -bottom-2 w-full h-full bg-slate-800 rounded-lg border-2 border-slate-700 -z-20"></div>
                <span class="text-xl font-black text-amber-500">{{ store.game.deckCount }}</span>
              </div>
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deck Pile</span>
            </div>
    
            <!-- Queen's Carpet (River) -->
            <section class="flex-grow flex flex-col items-center gap-4 py-6 bg-slate-900/20 rounded-3xl border border-slate-800/40 w-full max-w-5xl">
              <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">The Queen's Carpet</h2>
              
              <div class="grid grid-cols-7 gap-2 w-full px-4">
                <!-- Family Columns -->
                <div v-for="(data, family) in store.game.table" :key="family" class="flex flex-col gap-2 relative">
                  <!-- Status Indicator (Game Over only) -->
                  <div v-if="store.game.gameOver && family !== 'Mystery'" 
                       class="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[8px] font-black uppercase shadow-lg z-10"
                       :class="familyStatusClass(family)">
                    {{ familyStatusLabel(family) }}
                  </div>
    
                  <!-- Positive Section -->
                  <div class="h-32 bg-slate-900/60 rounded-t-xl border-t border-x border-slate-800/50 p-2 flex flex-col items-center gap-1 overflow-y-auto">
                    <span class="text-[8px] font-black text-green-500/50 uppercase mb-1">+</span>
                    <div v-for="card in data.positive" :key="card.id" 
                      @click="onBoardCardClick('table', null, card)"
                      :class="[
                        'w-full h-8 rounded-sm border shadow-sm flex items-center justify-center text-[8px] font-black text-white shrink-0 transition-all', 
                        (family === 'Mystery' && !store.game.gameOver) ? 'bg-slate-800 border-slate-700 text-slate-500' : cardColorClass(card.color),
                        canDiscard(card, 'table', null) ? 'cursor-pointer hover:scale-105 hover:brightness-125 ring-2 ring-red-500 ring-offset-1 ring-offset-slate-900' : ''
                      ]">
                      {{ (family === 'Mystery' && !store.game.gameOver) ? '?' : card.family.charAt(0) }}
                      <span v-if="card.role === 'Guard' && !(family === 'Mystery' && !store.game.gameOver)" class="ml-1 text-[6px]">🛡️</span>
                    </div>
                  </div>
    
                  <!-- Color Bar -->
                  <div :class="['h-6 flex items-center justify-center text-[10px] font-black uppercase tracking-tighter text-white shadow-lg', carpetColorClass(family)]">
                    {{ family === 'Mystery' ? '?' : family }}
                  </div>
    
                  <!-- Negative Section -->
                  <div class="h-32 bg-slate-900/60 rounded-b-xl border-b border-x border-slate-800/50 p-2 flex flex-col items-center gap-1 overflow-y-auto">
                    <div v-for="card in data.negative" :key="card.id" 
                      @click="onBoardCardClick('table', null, card)"
                      :class="[
                        'w-full h-8 rounded-sm border shadow-sm flex items-center justify-center text-[8px] font-black text-white shrink-0 transition-all', 
                        (family === 'Mystery' && !store.game.gameOver) ? 'bg-slate-800 border-slate-700 text-slate-500' : cardColorClass(card.color),
                        canDiscard(card, 'table', null) ? 'cursor-pointer hover:scale-105 hover:brightness-125 ring-2 ring-red-500 ring-offset-1 ring-offset-slate-900' : ''
                      ]">
                      {{ (family === 'Mystery' && !store.game.gameOver) ? '?' : card.family.charAt(0) }}
                      <span v-if="card.role === 'Guard' && !(family === 'Mystery' && !store.game.gameOver)" class="ml-1 text-[6px]">🛡️</span>
                    </div>
                    <span class="text-[8px] font-black text-red-500/50 uppercase mt-1">-</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
    

      <!-- Player Domains -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="player in store.game.players" 
          :key="player.id"
          :class="[
            'flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all',
            player.id === store.game.currentTurn ? 'border-amber-500 bg-slate-900 shadow-xl' : 'border-slate-800 bg-slate-900/50'
          ]"
        >
          <div class="flex justify-between items-center px-1">
            <span class="font-black text-xs uppercase tracking-tight truncate max-w-[120px]">{{ player.username }}</span>
            <span class="text-amber-500 font-mono text-sm font-bold">{{ player.score }}</span>
          </div>

          <div class="flex-grow flex flex-wrap content-start gap-1 p-3 bg-slate-950/50 rounded-xl min-h-[100px] border border-slate-800/30">
            <div 
              v-for="card in player.domain" 
              :key="card.id"
              @click="onBoardCardClick('player', player.id, card)"
              :class="[
                'w-8 h-12 rounded-sm border shadow-sm flex items-center justify-center text-[8px] font-black text-white shrink-0 transition-all relative', 
                (card.isMystery && player.id !== store.myId && !store.game.gameOver) ? 'bg-slate-800 border-slate-700 text-slate-500' : cardColorClass(card.color),
                canDiscard(card, 'player', player.id) ? 'cursor-pointer hover:scale-105 hover:brightness-125 ring-2 ring-red-500 ring-offset-1 ring-offset-slate-900' : ''
              ]"
            >
              {{ (card.isMystery && player.id !== store.myId && !store.game.gameOver) ? '?' : card.family.charAt(0) }}
              <span v-if="card.role === 'Guard' && !((card.isMystery && player.id !== store.myId && !store.game.gameOver))" class="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 scale-50">🛡️</span>
            </div>
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

const cardColorClass = (color) => {
  const colors = {
    red: 'bg-red-900 border-red-700',
    blue: 'bg-blue-900 border-blue-700',
    green: 'bg-green-900 border-green-700',
    yellow: 'bg-amber-900 border-amber-700',
    purple: 'bg-purple-900 border-purple-700',
    orange: 'bg-orange-900 border-orange-700',
  }
  return colors[color] || 'bg-slate-700'
}

const carpetColorClass = (family) => {
  const colors = {
    "Lion": "bg-red-600",
    "Fish": "bg-blue-600",
    "Bird": "bg-green-600",
    "Sun": "bg-yellow-500",
    "Moon": "bg-purple-600",
    "Star": "bg-orange-600",
    "Mystery": "bg-slate-700 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:10px_10px]"
  }
  return colors[family] || 'bg-slate-600'
}
</script>
