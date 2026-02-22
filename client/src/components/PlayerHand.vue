<template>
  <div class="flex flex-col gap-6">
    <div v-if="isMyTurn" class="flex flex-col gap-2">
      <h3 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] text-center">Your Turn's Decree</h3>
      <div v-if="store.game.turnActions.pendingAssassin" class="flex flex-col items-center gap-4 py-2 animate-in fade-in zoom-in duration-500">
        <div class="flex flex-col items-center gap-1">
          <p class="text-sm text-red-500 text-center uppercase font-black tracking-widest animate-pulse">
            🗡️ Assassin Deployed
          </p>
          <p class="text-[9px] text-slate-500 uppercase font-bold">Select a card in the target zone to eliminate</p>
        </div>
        <button
          @click="store.skipDiscard()"
          class="group relative"
        >
          <div class="absolute -inset-0.5 bg-slate-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
          <div class="relative px-6 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white font-black rounded-full text-[10px] uppercase transition-all">
            Mercy (Skip Discard)
          </div>
        </button>
      </div>
      <p v-else class="text-[10px] text-amber-500 text-center uppercase font-bold flex justify-center gap-4">
        <span :class="{'line-through opacity-20': store.game.turnActions.playedSelf}">1 to Domain</span>
        <span :class="{'line-through opacity-20': store.game.turnActions.playedOther}">1 to Opponent</span>
        <span :class="{'line-through opacity-20': store.game.turnActions.playedTable}">1 to Carpet</span>
      </p>
    </div>

    <!-- Hand cards -->
    <div v-if="!store.game.turnActions.pendingAssassin" class="flex flex-wrap items-center justify-center gap-4 py-2">
      <div
        v-for="card in store.game.myHand"
        :key="card.id"
        @click="selectCard(card)"
        :class="[
          'relative w-32 h-48 rounded-2xl border-2 transition-all cursor-pointer group overflow-hidden shadow-2xl card-shine',
          selectedCard?.id === card.id
            ? 'scale-110 -translate-y-8 ring-4 ring-amber-400/50 border-amber-400 z-10 shadow-amber-900/50'
            : 'border-slate-800/80 hover:-translate-y-4 hover:border-slate-600 active:scale-95',
          cardColorClass(card.color)
        ]"
      >
        <!-- Card Background Patterns -->
        <div class="absolute inset-0 opacity-10 pointer-events-none select-none">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
        </div>

        <!-- Role Icon Large BG -->
        <div class="absolute -right-4 -top-4 text-8xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500 select-none">
          {{ roleIcon(card.role) }}
        </div>

        <!-- Card Content -->
        <div class="relative h-full p-4 flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <div class="flex flex-col">
              <span class="text-4xl font-black font-serif text-white tracking-tighter leading-none">
                {{ card.family.charAt(0) }}
              </span>
              <span class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">{{ card.family }}</span>
            </div>
            <div class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
              <span class="text-xl drop-shadow-lg">{{ roleIcon(card.role) }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between gap-1 border-t border-white/10 pt-3">
             <span class="text-[9px] font-black text-white uppercase tracking-[0.3em] opacity-80">
              {{ card.role === 'Courtesan' ? '' : card.role }}
            </span>
            <div class="flex gap-0.5">
              <div v-for="i in card.value" :key="i" class="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Play Options -->
    <div v-if="selectedCard && !store.game.turnActions.pendingAssassin" class="flex flex-col items-center gap-6 py-4 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
      <div class="flex flex-wrap justify-center gap-4">
        <!-- Self -->
        <button
          v-if="!store.game.turnActions.playedSelf"
          @click="playCard('self')"
          class="group relative"
        >
          <div class="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div class="relative px-8 py-3 bg-slate-900 border border-emerald-500/50 hover:bg-emerald-950 text-emerald-400 font-black rounded-full text-xs uppercase shadow-xl transition-all flex items-center gap-3">
            <span class="text-lg">🏰</span> My Domain
          </div>
        </button>

        <!-- Carpet (Table) -->
        <div v-if="!store.game.turnActions.playedTable" class="flex items-center gap-4">
          <!-- Standard positions -->
          <div v-if="selectedCard.role !== 'Spy'" class="flex items-center gap-3">
            <button
              @click="playCard('table', null, 'positive')"
              class="px-8 py-3 bg-slate-900 border border-green-500/50 hover:bg-green-950 text-green-400 font-black rounded-full text-xs uppercase shadow-xl transition-all flex items-center gap-2"
            >
              <span>📈</span> Carpet +
            </button>
            <button
              @click="playCard('table', null, 'negative')"
              class="px-8 py-3 bg-slate-900 border border-red-500/50 hover:bg-red-950 text-red-400 font-black rounded-full text-xs uppercase shadow-xl transition-all flex items-center gap-2"
            >
              <span>📉</span> Carpet -
            </button>
          </div>

          <!-- Mystery positions -->
          <div v-if="selectedCard.role === 'Spy'" class="flex items-center gap-3">
            <button
              @click="playCard('mystery', null, 'positive')"
              class="px-8 py-3 bg-slate-900 border-2 border-dashed border-amber-500/50 hover:bg-amber-950 text-amber-500 font-black rounded-full text-xs uppercase shadow-xl transition-all flex items-center gap-3 animate-pulse hover:animate-none"
            >
              <span class="text-lg">❓</span> Mystery +
            </button>
            <button
              @click="playCard('mystery', null, 'negative')"
              class="px-8 py-3 bg-slate-900 border-2 border-dashed border-amber-500/50 hover:bg-amber-950 text-amber-500 font-black rounded-full text-xs uppercase shadow-xl transition-all flex items-center gap-3 animate-pulse hover:animate-none"
            >
              <span class="text-lg">❓</span> Mystery -
            </button>
          </div>
        </div>
      </div>

      <!-- Opponent selection -->
      <div v-if="!store.game.turnActions.playedOther" class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-4 w-full">
          <div class="h-px bg-slate-800 flex-grow"></div>
          <span class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Send to Court</span>
          <div class="h-px bg-slate-800 flex-grow"></div>
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="opponent in otherPlayers"
            :key="opponent.id"
            @click="playCard(selectedCard.role === 'Spy' ? 'other_mystery' : 'other', opponent.id)"
            class="px-6 py-2.5 bg-slate-800 hover:bg-red-900 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-white font-black rounded-full text-xs uppercase shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <span class="text-sm">👤</span> {{ opponent.username }}
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

const cardColorClass = (color) => {
  const colors = {
    red: 'bg-gradient-to-br from-red-700 to-red-950 border-red-500/50 shadow-red-950/50',
    blue: 'bg-gradient-to-br from-blue-700 to-blue-950 border-blue-500/50 shadow-blue-950/50',
    green: 'bg-gradient-to-br from-emerald-700 to-emerald-950 border-emerald-500/50 shadow-emerald-950/50',
    yellow: 'bg-gradient-to-br from-amber-600 to-amber-900 border-amber-400/50 shadow-amber-900/50',
    purple: 'bg-gradient-to-br from-purple-700 to-purple-950 border-purple-500/50 shadow-purple-950/50',
    olive: 'bg-gradient-to-br from-olive-600 to-olive-900 border-olive-500/50 shadow-olive-900/50',
  }
  return colors[color] || 'bg-slate-800'
}
</script>
