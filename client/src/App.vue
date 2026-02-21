<template>
  <div>
    <Lobby v-if="!store.game || (!store.game.started && !store.game.gameOver)" />
    <GameBoard v-else />
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useGameStore } from "./stores/gameStore"
import Lobby from "./components/Lobby.vue"
import GameBoard from "./components/GameBoard.vue"

const store = useGameStore()

onMounted(() => {
  store.init()
})
</script>