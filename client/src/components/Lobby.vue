<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] gap-8">
    <h1 class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">
      Courtisans
    </h1>
    
    <div v-if="!store.game" class="flex flex-col gap-4 w-full max-w-md p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Your Name</label>
        <input 
          v-model="username"
          type="text" 
          placeholder="Enter your name"
          class="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      <button 
        @click="store.createGame(username)"
        :disabled="!username"
        class="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-white font-bold rounded-lg transition-all transform hover:scale-105"
      >
        Create New Game
      </button>
      
      <div class="flex items-center gap-4 my-2">
        <div class="h-px bg-slate-700 flex-grow"></div>
        <span class="text-slate-500 text-sm uppercase">OR</span>
        <div class="h-px bg-slate-700 flex-grow"></div>
      </div>

      <div class="flex gap-2">
        <input 
          v-model="gameIdInput"
          type="text" 
          placeholder="Enter Game ID"
          class="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
        />
        <button 
          @click="store.joinGame(gameIdInput, username)"
          :disabled="!username || !gameIdInput"
          class="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg font-semibold transition-colors"
        >
          Join
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center gap-6 p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div class="text-center">
        <p class="text-slate-400 mb-1">Game ID</p>
        <p class="text-2xl font-mono text-amber-400">{{ store.game.id }}</p>
      </div>

      <div class="w-full">
        <h3 class="text-slate-400 mb-2 uppercase text-xs font-bold tracking-widest">Players ({{ store.game.players.length }}/5)</h3>
        <ul class="space-y-2">
          <li v-for="player in store.game.players" :key="player.id" class="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-700">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <span class="font-medium">{{ player.username }}</span>
            </div>
            <span v-if="player.id === store.myId" class="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded">YOU</span>
          </li>
        </ul>
      </div>

      <button 
        v-if="store.game.players[0].id === store.myId"
        @click="store.startGame()"
        :disabled="store.game.players.length < 2"
        class="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 text-white font-bold rounded-lg transition-all"
      >
        Start Game
      </button>
      <p v-else class="text-slate-400 italic">Waiting for host to start...</p>
    </div>

    <!-- Documentation Link -->
    <a 
      href="/src/assets/documentation.pdf" 
      target="_blank"
      class="flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors text-sm font-bold uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 hover:border-amber-500/50"
    >
      <span class="text-lg">📜</span> Game Rules & Documentation
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
</script>
