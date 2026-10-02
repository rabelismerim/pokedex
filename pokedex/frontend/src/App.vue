<script setup>
import { onMounted } from 'vue'
import { usePokemonStore } from './stores/usePokemonStore'
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'

const store = usePokemonStore()

onMounted(() => {
  store.fetchPokemons()
})
</script>

<template>
  <div class="pokedex-body">
    <LeftPanel />

    <!-- Haste central da Pokédex -->
    <div class="hinge">
      <div class="hinge-line"></div>
      <div class="hinge-line"></div>
    </div>

    <RightPanel />
  </div>
</template>

<style scoped>
.pokedex-body {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #1e1e24;
  padding: 30px;
  min-height: 100vh;
  font-family: 'Courier New', Courier, monospace;
}

.hinge {
  width: 30px;
  height: 520px;
  background: linear-gradient(90deg, #8b0000, #dc0a2d, #8b0000);
  border-top: 4px solid #8b0000;
  border-bottom: 4px solid #8b0000;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.hinge-line {
  width: 100%;
  height: 4px;
  background: #000;
}
</style>