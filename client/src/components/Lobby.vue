<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-10 p-6 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]">
    <!-- Decorative background elements -->
    <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/exclusive-paper.png')] opacity-10 pointer-events-none"></div>

    <div class="flex flex-col items-center gap-4 animate-float">
      <div class="w-20 h-20 rounded-3xl bg-amber-500 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.2)] border border-amber-400/50">
        <span class="text-5xl">🏛️</span>
      </div>
      <h1 class="text-7xl font-black text-white tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
        Courtisans
      </h1>
      <p class="text-amber-500/60 font-black uppercase tracking-[0.6em] text-[10px] -mt-2">Intrigue & Influence</p>
    </div>

    <div v-if="!store.game" class="flex flex-col gap-6 w-full max-w-md">
      <!-- Identity Card -->
      <div class="p-8 bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 relative group overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div class="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>
        <div class="flex flex-col gap-3 relative">
          <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Noble Identity</label>
          <div class="relative group/input">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-amber-500 transition-colors">👤</span>
            <input
              v-model="username"
              type="text"
              placeholder="Enter your name"
              class="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all text-white font-medium"
            />
          </div>
        </div>
      </div>

      <!-- Chamber Actions Card -->
      <div
        class="flex flex-col gap-6 p-10 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-slate-800 relative group overflow-hidden transition-all duration-500"
        :class="[!username ? 'opacity-40 grayscale pointer-events-none scale-95' : 'animate-in fade-in slide-in-from-bottom-12 duration-1000']"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>

        <button
          @click="store.createGame(username)"
          :disabled="!username"
          class="relative group/btn disabled:opacity-50"
        >
          <div class="absolute -inset-0.5 bg-amber-500 rounded-2xl blur opacity-20 group-hover/btn:opacity-60 transition duration-500"></div>
          <div class="relative w-full py-4 bg-amber-600 group-hover/btn:bg-amber-500 text-amber-950 font-black rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3">
            <span>✨</span> Create New Chamber
          </div>
        </button>

        <div class="flex items-center gap-6 my-2">
          <div class="h-px bg-slate-800 flex-grow"></div>
          <span class="text-slate-600 text-[10px] font-black tracking-widest uppercase">Or Join</span>
          <div class="h-px bg-slate-800 flex-grow"></div>
        </div>

        <div class="flex gap-3 relative">
          <input
            v-model="gameIdInput"
            type="text"
            placeholder="Chamber ID"
            class="flex-grow bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 focus:outline-none focus:border-amber-500/50 transition-all text-white font-mono text-sm uppercase"
          />
          <button
            @click="store.joinGame(gameIdInput, username)"
            :disabled="!username || !gameIdInput"
            class="px-8 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-2xl font-black transition-all text-xs uppercase tracking-widest border border-slate-700"
          >
            Enter
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center gap-8 w-full max-w-md p-10 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-slate-800 animate-in fade-in zoom-in duration-500">
      <div class="text-center relative">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 text-center">Chamber Access Code</p>
        <div class="flex items-center gap-4 bg-slate-950 px-8 py-3 rounded-2xl border border-amber-500/20 shadow-inner group/code relative">
          <p class="text-3xl font-mono text-amber-500 font-bold tracking-wider">{{ store.game.id.substring(0, 8).toUpperCase() }}</p>
          <button
            @click="copyCode"
            class="hover:cursor-pointer flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/30 transition-all text-amber-500 relative group/copy-btn"
          >
            <span v-if="!copied" class="text-lg">📋</span>
            <span v-else class="text-lg">✅</span>
            <div v-if="copied" class="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl animate-bounce">
              COPIED!
            </div>
          </button>
        </div>
      </div>

      <div class="w-full">
        <div class="flex justify-between items-end mb-4 px-1">
          <h3 class="text-slate-500 uppercase text-[10px] font-black tracking-[0.3em]">Noble Assembly</h3>
          <span class="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">{{ store.game.players.length }}/5</span>
        </div>
        <ul class="space-y-3">
          <li v-for="player in store.game.players" :key="player.id" class="flex items-center justify-between bg-slate-950/50 p-4 rounded-2xl border border-slate-800 group hover:border-slate-700 transition-all">
            <div class="flex items-center gap-4">
              <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span class="font-bold text-white tracking-wide uppercase text-sm">{{ player.username }}</span>
            </div>
            <span v-if="player.id === store.myId" class="text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full tracking-widest uppercase">Master</span>
          </li>
        </ul>
      </div>

            <button 
              v-if="store.game.players[0].id === store.myId"
              @click="store.startGame()"
              :disabled="store.game.players.length < 2"
              class="group relative w-full disabled:opacity-50"
            >
              <div class="absolute -inset-1 bg-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
              <div class="relative w-full py-4 bg-emerald-600 group-hover:bg-emerald-500 text-emerald-950 font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-sm shadow-xl">
                Begin Intrigue
              </div>
            </button>
            <div v-else class="flex flex-col items-center gap-3">
              <div class="flex gap-1">
                <div v-for="i in 3" :key="i" class="w-1.5 h-1.5 rounded-full bg-amber-500/50 animate-bounce" :style="{animationDelay: `${i*0.2}s`}"></div>
              </div>
              <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Waiting for the Decree...</p>
            </div>
      
            <!-- Quit Button -->
            <button 
              @click="store.quitGame()"
              class="w-full py-3 rounded-2xl border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-[0.3em]"
            >
              Leave Chamber
            </button>
          </div>
    <!-- Documentation Link -->
    <a
      href="/src/assets/documentation.pdf"
      target="_blank"
      class="flex items-center gap-3 text-slate-500 hover:text-amber-500 transition-all text-[10px] font-black uppercase tracking-[0.4em] bg-slate-900/40 px-6 py-3 rounded-2xl border border-slate-800 hover:border-amber-500/50 backdrop-blur-md group"
    >
      <span class="text-xl group-hover:rotate-12 transition-transform">📜</span> Royal Archives
    </a>

    <div v-if="store.error" class="fixed bottom-8 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ store.error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useGameStore } from "../stores/gameStore"

const store = useGameStore()
const gameIdInput = ref("")
const username = ref(store.username)
const copied = ref(false)

const copyCode = async () => {
  const code = store.game.id.substring(0, 8).toUpperCase()
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
