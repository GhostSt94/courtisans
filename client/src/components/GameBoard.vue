<template>
  <div class="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-amber-500/30">
    <!-- Background Texture -->
    <div class="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
    <div class="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_80%)] z-0"></div>

    <!-- Header -->
    <header class="relative z-20 px-8 py-3 bg-slate-900/90 border-b border-amber-500/10 flex justify-between items-center shrink-0 backdrop-blur-md shadow-2xl">
      <div class="flex items-center gap-5">
        <div class="relative group">
          <div class="absolute -inset-1 bg-amber-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 flex items-center justify-center shadow-inner">
            <span class="text-xl filter drop-shadow-md">🏛️</span>
          </div>
        </div>
        <div class="flex flex-col">
          <h1 class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 tracking-[0.2em] uppercase">Courtisans</h1>
        </div>
      </div>

      <!-- Center Header: Deck & Turn Info -->
      <div class="flex items-center gap-8">
        <!-- Deck Area -->
        <div class="flex items-center gap-3 px-4 py-1.5 bg-slate-950/50 border border-slate-800 rounded-2xl shadow-inner group">
          <div class="relative w-6 h-9 bg-amber-600 rounded border border-amber-400/50 shadow-lg transform -rotate-6 transition-transform group-hover:rotate-0">
             <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arches.png')] opacity-20"></div>
          </div>
          <div class="flex flex-col">
            <span class="text-[8px] text-slate-500 uppercase font-black tracking-widest">Royal Deck</span>
            <span class="text-sm font-black text-amber-500 leading-none">{{ store.game.deckCount }}</span>
          </div>
        </div>

        <div class="h-6 w-px bg-slate-800"></div>

        <!-- Turn Info -->
        <div class="flex flex-col items-center">
          <span class="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Current Player</span>
          <div class="px-5 py-1 bg-amber-950/30 border border-amber-500/20 rounded-full flex items-center">
            <span class="text-[10px] font-black text-amber-400 uppercase tracking-widest">
              {{ currentPlayerName }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <!-- Docs -->
          <a
                  href="/documentation.pdf"
                  target="_blank"
                  class="text-[8px] text-slate-500 uppercase font-black tracking-widest flex gap-0.5 items-center hover:underline"
          >
              Rules
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
          </a>

        <div class="h-8 w-px bg-slate-800"></div>
        <!-- Room Info -->
        <div class="flex flex-col items-end">
          <span class="text-[8px] text-slate-500 uppercase font-black tracking-widest">Chamber ID</span>
          <span class="font-mono text-[10px] text-slate-400 tracking-widest opacity-80 uppercase">{{ store.game.id.substring(0, 8) }}</span>
        </div>

        <div class="h-8 w-px bg-slate-800"></div>

        <!-- Leave Button -->
        <button
          @click="showQuitConfirm = true"
          class="flex items-center gap-3 group/quit cursor-pointer px-4 py-2 rounded-xl border border-red-500/10 hover:border-red-500/40 hover:bg-red-500/5 transition-all"
        >
          <span class="text-[9px] text-red-400 uppercase font-black tracking-widest group-hover:translate-x-0 translate-x-1 transition-all">Leave game</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-red-400 group-hover:scale-110 transition-transform">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Game Area -->
    <main class="relative z-10 flex-grow flex overflow-hidden p-4 gap-4">

      <!-- Quit Confirmation Modal -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 backdrop-blur-none"
        enter-to-class="opacity-100 backdrop-blur-md"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 backdrop-blur-md"
        leave-to-class="opacity-0 backdrop-blur-none"
      >
        <div v-if="showQuitConfirm" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-6">
          <div class="bg-slate-900 border border-red-500/30 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(239,68,68,0.1)] max-w-sm w-full relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent"></div>
            <div class="text-center relative z-10">
              <div class="text-5xl mb-6 transform group-hover:rotate-12 transition-transform">🥀</div>
              <h3 class="text-xl font-black text-white uppercase tracking-widest mb-3">Abandon Court?</h3>
              <p class="text-slate-400 text-xs font-medium leading-relaxed mb-8 uppercase tracking-wider">Are you certain you wish to abjure your position? Your influence will be lost.</p>

              <div class="flex flex-col gap-3">
                <button
                  @click="store.quitGame()"
                  class="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-red-900/20 active:scale-95"
                >
                  Yes, Leave Court
                </button>
                <button
                  @click="showQuitConfirm = false"
                  class="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-xs border border-slate-700 active:scale-95"
                >
                  Stay & Fight
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Winner Overlay (Same as before) -->
      <transition enter-active-class="transition duration-1000" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="store.game.gameOver" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
           <!-- ... winner content (abbreviated for brevity, keep existing logic) ... -->
           <div class="flex flex-col items-center gap-10 p-16 bg-slate-900 border border-amber-500/30 rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.2)]">
              <div class="text-8xl animate-bounce">👑</div>
              <h2 class="text-6xl font-black text-white uppercase">{{ winnerName }} Wins</h2>
              <div class="grid grid-cols-2 gap-4 w-full">
                <div v-for="p in sortedPlayers" :key="p.id" class="flex justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span class="font-bold">{{ p.username }}</span>
                  <span class="text-amber-500 font-mono">{{ p.score }}</span>
                </div>
              </div>
              <button @click="store.quitGame()" class="px-12 py-4 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-full uppercase transition-all shadow-2xl">
                Return to Court
              </button>
           </div>
        </div>
      </transition>

      <!-- Left Column: Players 1-2 -->
      <aside class="w-64 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
        <div v-for="player in leftPlayers" :key="player.id">
          <PlayerEstateCard :player="player" />
        </div>
      </aside>

      <!-- Center Stage: The Queen's Carpet -->
      <section class="flex-grow flex flex-col items-center min-w-[800px]">
        <div class="w-full bg-slate-900/80 backdrop-blur-sm rounded-[2.5rem] border border-slate-800/60 shadow-2xl overflow-hidden flex flex-col h-full max-h-[750px]">
           <div class="flex items-center gap-4 py-3 px-8 border-b border-slate-800/50 bg-slate-950/30 shrink-0">
              <h2 class="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.5em] mx-auto">The Queen's Carpet</h2>
            </div>

            <!-- Carpet Grid -->
            <div class="grid grid-cols-7 gap-px bg-slate-800/50 flex-grow overflow-hidden">
              <div v-for="(data, family) in store.game.table" :key="family" class="flex flex-col bg-slate-900/40 relative group h-full">
                <!-- Esteem -->
                <div class="flex-1 p-2 flex flex-col items-center gap-1.5 overflow-y-auto custom-scrollbar relative pt-7">
                    <h6 v-if="family === 'Mystery'" class="uppercase text-gray-400/40 font-black text-[9px] absolute top-1 right-[50%] translate-x-[50%]">Glory</h6>
                    <h6 v-else class="uppercase text-gray-400/40 font-black text-[9px] absolute top-1 right-[50%] translate-x-[50%]" :class="isDisgrace(data.positive, data.negative) === -1 ? '!text-green-600/40' : ''">Glory ({{sumValue(data.positive)}})</h6>
                  <div v-for="card in data.positive" :key="card.id"
                    @click="onBoardCardClick('table', null, card)"
                    :class="[
                      'w-9 h-12 rounded border shadow-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 transition-all relative transform hover:-translate-y-1',
                      (family === 'Mystery' && !store.game.gameOver) ? 'bg-slate-800 border-slate-700 text-slate-500' : cardColorClass(card.color),
                      canDiscard(card, 'table', null) ? 'cursor-pointer ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900 z-10 scale-110' : ''
                    ]">
                    {{ (family === 'Mystery' && !store.game.gameOver) ? '?' : card.family.charAt(0) }}
                    <span v-if="!(family === 'Mystery' && !store.game.gameOver)" class="absolute -top-1 -right-1 bg-slate-950 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[7px] border border-slate-700 shadow-sm">
                      {{ roleIcon(card.role) }}
                    </span>
                  </div>
                </div>

                <!-- Family Title -->
                <div class="h-10 shrink-0 relative flex items-center justify-center z-10">
                  <div :class="['absolute inset-0.5 rounded border opacity-80', carpetColorClass(family)]"></div>
                  <span class="relative z-10 text-[8px] font-black text-white uppercase tracking-widest drop-shadow-md">
                    {{ family === 'Mystery' ? '???' : family }}
                  </span>
                </div>

                <!-- Disgrace -->
                <div class="flex-1 p-2 flex flex-col items-center gap-1.5 overflow-y-auto custom-scrollbar border-t border-white/5 relative pb-6">
                  <div v-for="card in data.negative" :key="card.id"
                    @click="onBoardCardClick('table', null, card)"
                    :class="[
                      'w-9 h-12 rounded border shadow-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 transition-all relative transform hover:translate-y-1',
                      (family === 'Mystery' && !store.game.gameOver) ? 'bg-slate-800 border-slate-700 text-slate-500' : cardColorClass(card.color),
                      canDiscard(card, 'table', null) ? 'cursor-pointer ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900 z-10 scale-110' : ''
                    ]">
                    {{ (family === 'Mystery' && !store.game.gameOver) ? '?' : card.family.charAt(0) }}
                    <span v-if="!(family === 'Mystery' && !store.game.gameOver)" class="absolute -top-1 -right-1 bg-slate-950 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[7px] border border-slate-700 shadow-sm">
                      {{ roleIcon(card.role) }}
                    </span>
                  </div>
                    <h6 v-if="family === 'Mystery'" class="uppercase text-gray-400/40 font-black text-[9px] absolute bottom-1 right-[50%] translate-x-[50%]">Disgrace</h6>
                    <h6 v-else class="uppercase text-gray-400/40 font-black text-[9px] absolute bottom-1 right-[50%] translate-x-[50%]" :class="isDisgrace(data.positive, data.negative) === 1 ? 'text-red-500/40' :''">Disgrace ({{sumValue(data.negative)}})</h6>
                </div>
              </div>
            </div>
        </div>
      </section>

      <!-- Right Column: Players 3-5 -->
      <aside class="w-64 flex flex-col gap-4 overflow-y-auto custom-scrollbar pl-2">
        <div v-for="player in rightPlayers" :key="player.id">
          <PlayerEstateCard :player="player" />
        </div>
      </aside>

    </main>

    <!-- Bottom Interaction: Hand -->
    <footer class="p-4 bg-gradient-to-t from-slate-950 to-transparent shrink-0">
      <div class="max-w-4xl mx-auto">
        <PlayerHand />
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, ref } from "vue"
import { useGameStore } from "../stores/gameStore"
import PlayerHand from "./PlayerHand.vue"

const store = useGameStore()
const showQuitConfirm = ref(false)

// Split players for side columns
const leftPlayers = computed(() => store.game.players.slice(0, 2))
const rightPlayers = computed(() => store.game.players.slice(2, 5))

//
const sumValue = (array)=>{
    return array.reduce((total, obj) => {
        return total + (obj.value ?? 0);
    }, 0)
}
const isDisgrace = (positive, negative)=>{
    let ngt = negative.reduce((total, obj) => {
        return total + (obj.value ?? 0);
    }, 0)
    let pst = positive.reduce((total, obj) => {
        return total + (obj.value ?? 0);
    }, 0)
    if(ngt === pst) return null
    return ngt > pst ? 1 : -1
}
// Helper Component for Player Card
const PlayerEstateCard = defineComponent({
  props: ['player'],
  setup(props) {
    return () => h('div', {
      class: [
        'flex flex-col p-1 rounded-2xl transition-all duration-300 relative',
        props.player.id === store.game.currentTurn
          ? 'bg-gradient-to-b from-amber-500/20 to-amber-500/5 shadow-lg scale-[1.02] border border-amber-500/20'
          : 'bg-slate-800/30 hover:bg-slate-800/50 border border-slate-800/50'
      ]
    }, [
      // Header
      h('div', { class: 'flex justify-between items-center p-3 border-b border-white/5' }, [
        h('div', { class: 'flex items-center gap-2' }, [
           h('div', { class: 'w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px]' }, '👤'),
           h('div', { class: 'flex flex-col' }, [
              h('span', { class: 'text-[9px] font-bold text-white uppercase truncate max-w-[80px]' }, props.player.username),
              props.player.id === store.myId ? h('span', { class: 'text-[7px] text-amber-500 font-black uppercase' }, 'You') : null
           ])
        ]),
        h('div', { class: 'flex flex-col items-end' }, [
           h('span', { class: 'text-amber-500 font-mono text-sm font-black' }, props.player.score || '')
        ])
      ]),
      // Domain
      h('div', { class: 'p-3 min-h-[100px] bg-slate-950/30 rounded-b-[0.9rem] flex flex-wrap content-start gap-1.5' },
        props.player.domain.length === 0
          ? [h('span', { class: 'text-[8px] uppercase font-black text-slate-600 m-auto opacity-40' }, 'Empty')]
          : props.player.domain.map(card => h('div', {
              onClick: () => onBoardCardClick('player', props.player.id, card),
              class: [
                'w-8 h-11 rounded border shadow-md flex items-center justify-center text-[8px] font-black text-white shrink-0 transition-all relative',
                (card.isMystery && props.player.id !== store.myId && !store.game.gameOver) ? 'bg-slate-800 border-slate-700 text-slate-500' : cardColorClass(card.color),
                canDiscard(card, 'player', props.player.id) ? 'cursor-pointer ring-2 ring-red-500 z-10 scale-110' : ''
              ]
            }, [
              (card.isMystery && props.player.id !== store.myId && !store.game.gameOver) ? '?' : card.family.charAt(0),
              !((card.isMystery && props.player.id !== store.myId && !store.game.gameOver)) ? h('span', { class: 'absolute -top-1 -right-1 bg-slate-950 rounded-full w-3 h-3 flex items-center justify-center text-[6px] border border-slate-700' }, roleIcon(card.role)) : null
            ]))
      )
    ])
  }
})

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
  if (card.id === az.playedCardId) return false;

  if (az.targetType === 'table' || az.targetType === 'mystery') return targetType === 'table';
  if (az.targetType === 'self') return targetType === 'player' && targetPlayerId === store.myId;
  if (az.targetType === 'other' || az.targetType === 'other_mystery') return targetType === 'player' && targetPlayerId === az.targetPlayerId;
  return false;
}

const onBoardCardClick = (targetType, targetPlayerId, card) => {
  if (canDiscard(card, targetType, targetPlayerId)) {
    store.discardCard(targetType, targetPlayerId, card.id)
  }
}

const cardColorClass = (color) => {
  const colors = {
    red: 'bg-gradient-to-br from-[#DC143C] to-[#4a0415] border-[#DC143C]/50',
    blue: 'bg-gradient-to-br from-[#6495ED] to-[#0b1f4b] border-[#6495ED]/40',
    green: 'bg-gradient-to-br from-[#08542f] to-[#043821] border-[#08542f]/40',
    yellow: 'bg-gradient-to-br from-[#ffa700] to-[#7a3f00] border-[#ffa700]/80',
    purple: 'bg-gradient-to-br from-[#B9D9EB] to-[#B9D9EB] border-[#B9D9EB]/40',
      olive: 'bg-gradient-to-br from-[#6B8E23] to-[#2f3e12]/80 border-olive-400/40',
  }
  return colors[color] || 'bg-slate-700'
}

const carpetColorClass = (family) => {
  const colors = {
    "Lion": "bg-[#DC143C] border-[#4a0415]/50",
    "Fish": "bg-[#6495ED] border-[#6495ED]/50",
    "Bird": "bg-[#08542f] border-[#043821]/50",
    "Sun": "bg-[#ffa700] border-[#7a3f00]/50",
    "Moon": "bg-[#B9D9EB] border-[#B9D9EB]/50",
    "Star": "bg-[#6B8E23] border-[#2f3e12]/50",
    "Mystery": "bg-slate-800 border-slate-600/50 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4px_4px]"
  }
  return colors[family] || 'bg-slate-600'
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
</style>
