<template>
  <div class="flex flex-col gap-6">
    <div v-if="isMyTurn" class="flex flex-col gap-2">
      <h3 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] text-center">Your Turn's Decree</h3>
      <div v-if="store.game.turnActions.pendingAssassin" class="flex flex-col items-center gap-2">
        <p class="text-xs text-red-500 text-center uppercase font-black animate-pulse">
          ASSASSIN PLAYED! Select a card on the board to discard.
        </p>
        <button 
          @click="store.skipDiscard()"
          class="px-4 py-1.5 bg-slate-800 border-2 border-slate-600 hover:bg-slate-700 text-slate-400 font-black rounded-full text-[8px] uppercase transition-all hover:text-white"
        >
          Skip Discard
        </button>
      </div>
      <p v-else class="text-[10px] text-amber-500 text-center uppercase font-bold flex justify-center gap-4">
        <span :class="{'line-through opacity-20': store.game.turnActions.playedSelf}">1 to Domain</span>
        <span :class="{'line-through opacity-20': store.game.turnActions.playedOther}">1 to Opponent</span>
        <span :class="{'line-through opacity-20': store.game.turnActions.playedTable}">1 to Carpet</span>
      </p>
    </div>

    <!-- Hand cards -->
    <div v-if="!store.game.turnActions.pendingAssassin" class="flex flex-wrap items-center justify-center gap-6">
      <div 
        v-for="card in store.game.myHand" 
        :key="card.id"
        @click="selectCard(card)"
        :class="[
          'relative w-28 h-40 rounded-xl border-2 transition-all cursor-pointer group overflow-hidden shadow-2xl',
          selectedCard?.id === card.id ? 'scale-110 -translate-y-4 ring-4 ring-amber-400 border-amber-400' : 'border-slate-700 hover:-translate-y-2',
          cardColorClass(card.color)
        ]"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div class="p-3 flex flex-col gap-1">
          <span class="text-3xl font-black font-mono text-white tracking-tighter">
            {{ card.family.charAt(0) }}
          </span>
          <span class="text-[8px] font-black text-white/50 uppercase tracking-tighter">{{ card.role }}</span>
        </div>
        <div class="absolute bottom-3 left-0 right-0 text-center font-black text-[10px] uppercase text-white/90 tracking-widest">
          {{ card.family }}
        </div>
      </div>
    </div>

    <!-- Play Options -->
    <div v-if="selectedCard && !store.game.turnActions.pendingAssassin" class="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div class="flex flex-wrap justify-center gap-4">
        <!-- Self (Hidden for Spies) -->
        <button 
          v-if="!store.game.turnActions.playedSelf && selectedCard.role !== 'Spy'"
          @click="playCard('self')"
          class="flex flex-col items-center gap-1 group"
        >
          <div class="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-black rounded-full text-[10px] uppercase shadow-lg shadow-green-900/20 transition-all group-hover:scale-105">
            My Domain
          </div>
        </button>

        <!-- Carpet (Table) -->
        <div v-if="!store.game.turnActions.playedTable" class="flex items-center gap-2">
          <!-- Standard positions (Forbidden for Spies) -->
          <div v-if="selectedCard.role !== 'Spy'" class="flex items-center gap-2">
            <button 
              @click="playCard('table', null, 'positive')"
              class="px-6 py-2 bg-slate-800 border-2 border-green-500/50 hover:bg-green-900/40 text-green-400 font-black rounded-full text-[10px] uppercase shadow-lg transition-all"
            >
              Carpet +
            </button>
            <button 
              @click="playCard('table', null, 'negative')"
              class="px-6 py-2 bg-slate-800 border-2 border-red-500/50 hover:bg-red-900/40 text-red-400 font-black rounded-full text-[10px] uppercase shadow-lg transition-all"
            >
              Carpet -
            </button>
          </div>

          <!-- Mystery positions (REQUIRED for Spies, FORBIDDEN for others) -->
          <div v-if="selectedCard.role === 'Spy'" class="flex items-center gap-2">
            <button 
              @click="playCard('mystery', null, 'positive')"
              class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-full text-[8px] uppercase border-2 border-dashed border-white/20 shadow-xl animate-pulse"
            >
              Mystery +
            </button>
            <button 
              @click="playCard('mystery', null, 'negative')"
              class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-full text-[8px] uppercase border-2 border-dashed border-white/20 shadow-xl animate-pulse"
            >
              Mystery -
            </button>
          </div>
        </div>
      </div>
      
      <!-- Opponent selection -->
      <div v-if="!store.game.turnActions.playedOther" class="flex flex-col items-center gap-3">
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">To Opponent</span>
        <div class="flex flex-wrap justify-center gap-2">
          <button 
            v-for="opponent in otherPlayers" 
            :key="opponent.id"
            @click="playCard('other', opponent.id)"
            v-if="selectedCard.role !== 'Spy'"
            class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-full text-[10px] uppercase shadow-lg shadow-red-900/20"
          >
            {{ opponent.username }}
          </button>
          <button 
            v-for="opponent in otherPlayers" 
            :key="opponent.id"
            @click="playCard('other_mystery', opponent.id)"
            v-if="selectedCard.role === 'Spy'"
            class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-full text-[10px] uppercase border-2 border-dashed border-white/20 shadow-xl animate-pulse"
          >
            {{ opponent.username }} (Mystery)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useGameStore } from "../stores/gameStore"

const store = useGameStore()
const selectedCard = ref(null)

const isMyTurn = computed(() => store.game.currentTurn === store.myId)
const otherPlayers = computed(() => store.game.players.filter(p => p.id !== store.myId))

const selectCard = (card) => {
  if (selectedCard.value?.id === card.id) {
    selectedCard.value = null
  } else {
    selectedCard.value = card
  }
}

const playCard = (targetType, targetPlayerId = null, position = null) => {
  if (selectedCard.value) {
    store.playCard(selectedCard.value.id, targetType, targetPlayerId, position)
    selectedCard.value = null
  }
}

watch(() => store.game?.myHand?.length, () => {
  selectedCard.value = null
})

const cardColorClass = (color) => {
  const colors = {
    red: 'bg-red-900 border-red-700 shadow-red-900/30',
    blue: 'bg-blue-900 border-blue-700 shadow-blue-900/30',
    green: 'bg-green-900 border-green-700 shadow-green-900/30',
    yellow: 'bg-amber-900 border-amber-700 shadow-amber-900/30',
    purple: 'bg-purple-900 border-purple-700 shadow-purple-900/30',
    orange: 'bg-orange-900 border-orange-700 shadow-orange-900/30',
  }
  return colors[color] || 'bg-slate-800'
}
</script>
