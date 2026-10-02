<script setup>
import { usePokemonStore } from '../stores/usePokemonStore'

const store = usePokemonStore()
</script>

<template>
  <div class="left-panel">
    <!-- Luzes do topo -->
    <div class="top-lights">
      <div class="big-blue-light" :class="{ 'glowing': store.loading }">
        <div class="light-reflection"></div>
      </div>
      <div class="small-lights">
        <span class="light red"></span>
        <span class="light yellow"></span>
        <span class="light green"></span>
      </div>
    </div>

    <!-- Tela Esquerda -->
    <div class="screen-container">
      <div class="screen-header">
        <span class="dot red-dot"></span>
        <span class="dot red-dot"></span>
      </div>
      
      <div class="main-screen">
        <div v-if="store.selectedPokemon" class="poke-display">
          <button class="fav-star" @click="store.toggleFavorite(store.selectedPokemon)">
            {{ store.selectedPokemon.is_favorite ? '⭐' : '☆' }}
          </button>
          <img :src="store.selectedPokemon.image_url" :alt="store.selectedPokemon.name" />
        </div>
        <div v-else class="empty-screen">
          <span>{{ store.loading ? 'Carregando...' : 'Nenhum Pokémon' }}</span>
        </div>
      </div>

      <div class="screen-footer">
        <button 
          class="big-red-btn" 
          :class="{ active: !store.isMuted }" 
          @click="store.toggleMute" 
          :title="store.isMuted ? 'Ativar Voz' : 'Desativar Voz'"
        ></button>
        <div class="speakers">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <!-- Controles -->
    <div class="controls">
      <button class="black-btn" @click="store.seedDatabase">IMPORTAR</button>
      <div class="pill-btns">
        <button 
          class="pill-btn fav-filter" 
          :class="{ active: store.showOnlyFavorites }" 
          @click="store.showOnlyFavorites = !store.showOnlyFavorites"
        >
          {{ store.showOnlyFavorites ? '⭐ FAVS' : 'TODOS' }}
        </button>
      </div>
      <div class="dpad">
        <button class="dpad-btn up" @click="store.playBeep(600)"></button>
        <button class="dpad-btn right" @click="store.nextPokemon"></button>
        <button class="dpad-btn down" @click="store.playBeep(600)"></button>
        <button class="dpad-btn left" @click="store.prevPokemon"></button>
        <div class="dpad-center"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.left-panel {
  width: 400px;
  background: #dc0a2d;
  border: 4px solid #8b0000;
  border-radius: 20px 0 0 20px;
  padding: 20px;
  box-shadow: -10px 10px 0px rgba(0,0,0,0.5);
}

.top-lights { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }

.big-blue-light {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 30% 30%, #00f0ff, #0088cc, #003366);
  border: 4px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 12px #00f0ff;
  position: relative;
}

.big-blue-light.glowing { animation: pulse-glow 0.8s infinite alternate; }

@keyframes pulse-glow {
  0% { box-shadow: 0 0 5px #00f0ff; transform: scale(0.98); }
  100% { box-shadow: 0 0 25px #00f0ff; transform: scale(1.05); }
}

.light-reflection {
  width: 15px; height: 15px; background: rgba(255, 255, 255, 0.8);
  border-radius: 50%; position: absolute; top: 8px; left: 8px;
}

.small-lights { display: flex; gap: 8px; }
.light { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #000; }
.light.red { background: #ff0000; box-shadow: 0 0 5px #ff0000; }
.light.yellow { background: #ffcc00; box-shadow: 0 0 5px #ffcc00; }
.light.green { background: #00ff00; box-shadow: 0 0 5px #00ff00; }

.screen-container {
  background: #dedede; border: 3px solid #000;
  border-radius: 15px 15px 15px 40px; padding: 15px;
}

.screen-header { display: flex; justify-content: center; gap: 15px; margin-bottom: 8px; }
.dot { width: 8px; height: 8px; background: #ff0000; border-radius: 50%; }

.main-screen {
  background: #222; border: 3px solid #000; border-radius: 10px;
  height: 220px; display: flex; justify-content: center; align-items: center; position: relative;
}

.poke-display img { width: 180px; height: 180px; object-fit: contain; }
.fav-star { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.6rem; cursor: pointer; }
.empty-screen { color: #00ff00; }

.screen-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.big-red-btn {
  width: 25px; height: 25px; background: #770000; border: 2px solid #000;
  border-radius: 50%; cursor: pointer;
}
.big-red-btn.active { background: #ff0000; box-shadow: 0 0 8px #ff0000; }

.speakers span { display: block; width: 30px; height: 3px; background: #333; margin: 3px 0; }
.controls { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }

.black-btn {
  background: #222; color: #fff; border: 2px solid #000; padding: 10px 12px;
  border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 0.75rem;
}

.pill-btn {
  background: #0088cc; color: white; border: 2px solid #000; padding: 6px 10px;
  border-radius: 12px; font-size: 0.7rem; font-weight: bold; cursor: pointer;
}
.pill-btn.active { background: #ffb703; color: #000; }

.dpad { width: 80px; height: 80px; position: relative; }
.dpad-btn { position: absolute; background: #222; border: 1px solid #000; cursor: pointer; }
.dpad-btn.up { top: 0; left: 27px; width: 26px; height: 27px; border-radius: 4px 4px 0 0; }
.dpad-btn.down { bottom: 0; left: 27px; width: 26px; height: 27px; border-radius: 0 0 4px 4px; }
.dpad-btn.left { top: 27px; left: 0; width: 27px; height: 26px; border-radius: 4px 0 0 4px; }
.dpad-btn.right { top: 27px; right: 0; width: 27px; height: 26px; border-radius: 0 4px 4px 0; }
.dpad-center { position: absolute; top: 27px; left: 27px; width: 26px; height: 26px; background: #222; }
</style>