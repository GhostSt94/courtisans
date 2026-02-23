<template>
  <div class="flex items-center justify-between gap-4 w-full mx-auto h-full min-h-[220px]">
    <!-- Left Section: Missions -->
    <div class="w-56 flex flex-col gap-3 h-full justify-center">
      <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Secret Missions</h3>
      <div v-if="myMissions.length" class="flex flex-col gap-2 overflow-y-auto max-h-[180px] custom-scrollbar pr-2">
        <div
          v-for="mission in myMissions"
          :key="mission.id"
          class="group relative"
        >
          <div :class="[
            'relative px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col gap-1 transition-all hover:bg-slate-900 shadow-lg',
            mission.completed === true ? 'border-green-500/40 bg-green-950/20' :
            mission.completed === false ? 'border-red-500/20 opacity-60' : ''
          ]">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest truncate">{{ mission.name }}</span>
              <span class="text-[9px] font-black text-slate-500">+{{ mission.points }}</span>
            </div>
            <p class="text-[9px] text-slate-400 font-bold leading-tight uppercase tracking-wider line-clamp-2">{{ mission.description }}</p>
            <div v-if="mission.completed !== undefined" class="mt-1 flex justify-end">
              <span v-if="mission.completed" class="text-[8px] font-black text-green-500 uppercase flex items-center gap-1">✓ Completed</span>
              <span v-else class="text-[8px] font-black text-red-500 uppercase flex items-center gap-1">✗ Failed</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-[10px] text-slate-700 uppercase font-black opacity-30 italic">No missions assigned</p>
    </div>

    <!-- Middle Section: Cards & Turn Status -->
    <div class="flex-grow flex flex-col items-center justify-center gap-4">
      <div v-if="isMyTurn" class="flex flex-col items-center gap-1">
        <div v-if="store.game.turnActions.pendingAssassin" class="flex flex-col items-center gap-2">
          <p class="text-sm text-red-500 font-black uppercase tracking-[0.2em] animate-pulse">🗡️ Assassin Deployed</p>
          <button @click="store.skipDiscard()" class="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-400 uppercase font-black hover:text-white hover:bg-slate-700 transition-all cursor-pointer">Spare Card (Skip)</button>
        </div>
        <div v-else class="flex flex-col items-center">
          <p class="text-[10px] text-amber-500 uppercase font-black tracking-[0.4em] mb-1">Your Turn</p>
          <div class="flex gap-4 opacity-40 text-[8px] font-black uppercase tracking-widest">
            <span :class="{'line-through !opacity-100 !text-slate-500': store.game.turnActions.playedSelf}">To Domain</span>
            <span :class="{'line-through !opacity-100 !text-slate-500': store.game.turnActions.playedOther}">To Opponent</span>
            <span :class="{'line-through !opacity-100 !text-slate-500': store.game.turnActions.playedTable}">To Carpet</span>
          </div>
        </div>
      </div>

      <!-- Hand cards (Original Size & Design) -->
      <div v-if="!store.game.turnActions.pendingAssassin" class="flex items-center justify-center gap-4">
        <div
          v-for="card in store.game.myHand"
          :key="card.id"
          @click="selectCard(card)"
          :class="[
            'relative w-32 h-48 rounded-2xl border-2 transition-all cursor-pointer group overflow-hidden shadow-2xl card-shine',
            selectedCard?.id === card.id
              ? 'scale-110 -translate-y-6 ring-4 ring-amber-400/50 border-amber-400 z-10 shadow-amber-900/50'
              : 'border-slate-800/80 hover:-translate-y-3 hover:border-slate-600 active:scale-95',
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
            <div class="flex flex-col justify-between items-start">
              <div class="flex justify-between w-full">
                <span class="flex-1 text-4xl font-black font-serif text-white tracking-tighter leading-none text-outline-black">
                  {{ card.family.charAt(0) }}
                </span>
                  <div :title="roleDescription(card.role)" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                      <span class="text-xl drop-shadow-lg">{{ roleIcon(card.role) }}</span>
                  </div>
              </div>
                <div>
                  <span class="text-[10px] font-black text-grey-300/40 uppercase tracking-[0.2em] mt-1">{{ card.family }}</span>
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
    </div>

    <!-- Right Section: Actions -->
    <div class="w-64 flex flex-col gap-3 h-full justify-center">
      <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1 text-right">Court Actions</h3>

      <div v-if="selectedCard && !store.game.turnActions.pendingAssassin" class="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
        <!-- Self / Carpet Buttons -->
        <div class="grid grid-cols-2 gap-2">
          <button v-if="!store.game.turnActions.playedSelf" @click="playCard('self')" class="px-3 py-3 bg-slate-900 border border-emerald-500/40 hover:bg-emerald-950 text-emerald-400 font-black rounded-xl text-[10px] uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95">
            🏰 My Domain
          </button>

          <template v-if="!store.game.turnActions.playedTable">
            <button v-if="selectedCard.role !== 'Spy'" @click="playCard('table', null, 'positive')" class="px-3 py-3 bg-slate-900 border border-green-500/40 hover:bg-green-950 text-green-400 font-black rounded-xl text-[10px] uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              📈 Favor
            </button>
            <button v-if="selectedCard.role !== 'Spy'" @click="playCard('table', null, 'negative')" class="px-3 py-3 bg-slate-900 border border-red-500/40 hover:bg-red-950 text-red-400 font-black rounded-xl text-[10px] uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              📉 Disgrace
            </button>

            <button v-if="selectedCard.role === 'Spy'" @click="playCard('mystery', null, 'positive')" class="col-span-1 px-3 py-3 bg-slate-900 border border-amber-500/40 hover:bg-amber-950 text-amber-500 font-black rounded-xl text-[10px] uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 border-dashed">
              ❓ Hidden+
            </button>
            <button v-if="selectedCard.role === 'Spy'" @click="playCard('mystery', null, 'negative')" class="col-span-1 px-3 py-3 bg-slate-900 border border-amber-500/40 hover:bg-amber-950 text-amber-500 font-black rounded-xl text-[10px] uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 border-dashed">
              ❓ Hidden-
            </button>
          </template>
        </div>

        <!-- Opponent selection -->
        <div v-if="!store.game.turnActions.playedOther" class="flex flex-col gap-2 mt-1">
          <div class="flex items-center gap-2">
            <div class="h-px bg-slate-800 flex-grow"></div>
            <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">Send to Court</span>
            <div class="h-px bg-slate-800 flex-grow"></div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opponent in otherPlayers"
              :key="opponent.id"
              @click="playCard(selectedCard.role === 'Spy' ? 'other_mystery' : 'other', opponent.id)"
              class="px-3 py-2 bg-slate-800 hover:bg-red-900/50 border border-slate-700 hover:border-red-500/40 text-slate-300 font-black rounded-xl text-[9px] uppercase transition-all truncate cursor-pointer active:scale-95"
            >
              👤 {{ opponent.username }}
            </button>
          </div>
        </div>
      </div>
      <div v-else-if="isMyTurn" class="bg-slate-950/30 border border-slate-800/50 rounded-2xl p-4 text-center">
        <p class="text-[9px] text-slate-600 uppercase font-black italic tracking-widest">Select a card from your hand to influence the court</p>
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

const myMissions = computed(() => {
  const me = store.game.players.find(p => p.id === store.myId)
  return me ? me.missions : []
})

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

const roleDescription = (role) => {
    const icons = {
        Noble: 'At the end of the Game, every Noble count as 2 cards',
        Spy: 'The Spy is played face down hidden, no one knows in which family the card belongs until the end of the game',
        Assassin: 'When played in a zone, you can choose to discard a card from that zone (the queen\'s carpet count as one zone)',
        Guard: 'This card can\'t be targeted by the Assassin',
        Courtesan: 'A standard court member with no special abilities',
    }
    return icons[role] || ''
}

const cardColorClass = (color) => {
  const colors = {
    red: 'bg-gradient-to-br from-[#DC143C] to-[#4a0415] border-[#DC143C]/50 shadow-[#DC143C]/30',
    blue: 'bg-gradient-to-br from-[#6495ED] to-blue-950 border-[#6495ED]/50 shadow-blue-950/40',
    green: 'bg-gradient-to-br from-[#08542f] to-[#043821] border-[#08542f]/50 shadow-[#043821]/40',
    yellow: 'bg-gradient-to-br from-[#ffa700] to-[#7a3f00] border-[#ffa700]/50 shadow-[#ffa700]/30',
    purple: 'bg-gradient-to-br from-[#B9D9EB] to-[#B9D9EB] border-[#B9D9EB]/50 shadow-[#F0F8FF]/20',
    olive: 'bg-gradient-to-br from-[#6B8E23] to-[#2f3e12] border-[#6B8E23]/50 shadow-olive-900/40',
  }
  return colors[color] || 'bg-slate-800'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.2);
  border-radius: 4px;
}

.text-outline-black {
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

.card-shine::after {
  content: '';
  position: absolute;
  top: -110%;
  left: -210%;
  width: 200%;
  height: 200%;
  opacity: 0;
  transform: rotate(30deg);
  background: rgba(255, 255, 255, 0.13);
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.13) 0%,
    rgba(255, 255, 255, 0.13) 77%,
    rgba(255, 255, 255, 0.5) 92%,
    rgba(255, 255, 255, 0.0) 100%
  );
}

.card-shine:hover::after {
  opacity: 1;
  top: -30%;
  left: -30%;
  transition-property: left, top, opacity;
  transition-duration: 0.7s, 0.7s, 0.15s;
  transition-timing-function: ease;
}
</style>
