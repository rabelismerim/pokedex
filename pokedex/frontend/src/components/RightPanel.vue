<script setup>
import { usePokemonStore } from '../stores/usePokemonStore'

const store = usePokemonStore()
</script>

<template>
  <div class="right-panel">
    <!-- Tela Verde de Informações -->
    <div class="green-screen">
      <div v-if="store.selectedPokemon" class="info-view">
        <div class="info-header">
          <h2>#{{ String(store.selectedPokemon.poke_id).padStart(3, '0') }} {{ store.selectedPokemon.name.toUpperCase() }}</h2>
        </div>
        <div class="types-list">
          <span class="badge" :class="store.selectedPokemon.primary_type">{{ store.selectedPokemon.primary_type }}</span>
          <span v-if="store.selectedPokemon.secondary_type" class="badge" :class="store.selectedPokemon.secondary_type">
            {{ store.selectedPokemon.secondary_type }}
          </span>
        </div>
      </div>
      
      <!-- Campo de Busca -->
      <div class="search-box">
        <input 
          v-model="store.search" 
          type="text" 
          placeholder="Buscar por nome ou ID..." 
        />
      </div>

      <!-- Filtro por Chip de Tipos -->
      <div class="type-filter-chips">
        <button 
          class="chip" 
          :class="{ active: store.selectedType === '' }" 
          @click="store.selectedType = ''"
        >
          Todos
        </button>
        <button 
          v-for="type in store.pokemonTypes" 
          :key="type" 
          class="chip" 
          :class="[type, { active: store.selectedType === type }]"
          @click="store.selectedType = store.selectedType === type ? '' : type"
        >
          {{ type }}
        </button>
      </div>

      <!-- Lista Scrollável -->
      <div class="pokemon-list-scroll">
        <div 
          v-for="poke in store.filteredPokemons" 
          :key="poke.id" 
          class="list-item"
          :class="{ active: store.selectedPokemon && store.selectedPokemon.id === poke.id }"
          @click="store.selectPokemon(poke)"
        >
          <span>#{{ String(poke.poke_id).padStart(3, '0') }} - {{ poke.name.toUpperCase() }}</span>
          <span v-if="poke.is_favorite">⭐</span>
        </div>
        <div v-if="store.filteredPokemons.length === 0" class="no-results">
          Nenhum resultado encontrado
        </div>
      </div>
    </div>

    <!-- Botões da Grid Azul -->
    <div class="blue-grid-buttons">
      <div class="blue-btn" v-for="n in 10" :key="n" @click="store.playBeep(400 + n * 50)"></div>
    </div>

    <!-- Controles Inferiores -->
    <div class="right-controls">
      <div class="nav-arrows">
        <button class="arrow-btn" @click="store.prevPokemon">◀</button>
        <button class="arrow-btn" @click="store.nextPokemon">▶</button>
      </div>
      <button class="yellow-action-btn" @click="store.toggleMute">
        {{ store.isMuted ? '🔊 LIGAR VOZ' : '🔇 MUTAR VOZ' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.right-panel {
  width: 400px;
  background: #dc0a2d;
  border: 4px solid #8b0000;
  border-radius: 0 20px 20px 20px;
  padding: 20px;
  box-shadow: 10px 10px 0px rgba(0,0,0,0.5);
  margin-top: 40px;
}

.green-screen {
  background: #51ae5f; border: 3px solid #000; border-radius: 10px;
  padding: 12px; height: 300px; display: flex; flex-direction: column; gap: 8px;
}

.info-header h2 { margin: 0; font-size: 1.1rem; color: #000; }
.types-list { display: flex; gap: 5px; margin-top: 4px; }

.badge {
  padding: 2px 8px; border-radius: 8px; font-size: 0.7rem; color: #fff;
  font-weight: bold; text-transform: uppercase; border: 1px solid #000;
}

.badge.grass, .chip.grass { background-color: #78c850; }
.badge.fire, .chip.fire { background-color: #f08030; }
.badge.water, .chip.water { background-color: #6890f0; }
.badge.bug, .chip.bug { background-color: #a8b820; }
.badge.normal, .chip.normal { background-color: #a8a878; }
.badge.poison, .chip.poison { background-color: #a040a0; }
.badge.electric, .chip.electric { background-color: #f8d030; color: #000; }
.badge.ground, .chip.ground { background-color: #e0c068; color: #000; }
.badge.fairy, .chip.fairy { background-color: #ee99ac; color: #000; }
.badge.fighting, .chip.fighting { background-color: #c03028; }
.badge.psychic, .chip.psychic { background-color: #f85888; }
.badge.rock, .chip.rock { background-color: #b8a038; }
.badge.ghost, .chip.ghost { background-color: #705898; }
.badge.dragon, .chip.dragon { background-color: #7038f8; }

.search-box input {
  width: 100%; padding: 6px; background: #a8dba8; border: 2px solid #000;
  border-radius: 5px; font-family: inherit; font-weight: bold; outline: none;
}

.type-filter-chips { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 4px; }

.chip {
  padding: 3px 6px; border: 1px solid #000; border-radius: 4px; font-size: 0.65rem;
  font-weight: bold; cursor: pointer; background: #3b8347; color: #fff; text-transform: capitalize; white-space: nowrap;
}
.chip.active { border: 2px solid #fff; box-shadow: 0 0 5px #fff; }

.pokemon-list-scroll {
  flex: 1; overflow-y: auto; background: #3b8347; border: 2px solid #000;
  border-radius: 5px; padding: 5px;
}

.list-item {
  padding: 5px 8px; font-size: 0.8rem; font-weight: bold; color: #000; cursor: pointer;
  display: flex; justify-content: space-between; border-bottom: 1px dashed #28572e;
}
.list-item:hover { background: #7ec288; }
.list-item.active { background: #a8dba8; border-left: 4px solid #000; }

.no-results { font-size: 0.75rem; color: #000; text-align: center; padding: 10px; }

.blue-grid-buttons { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-top: 15px; }
.blue-btn { height: 25px; background: #0088cc; border: 2px solid #000; border-radius: 4px; cursor: pointer; }

.right-controls { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; }
.nav-arrows { display: flex; gap: 10px; }
.arrow-btn { background: #e0e0e0; border: 2px solid #000; padding: 8px 15px; font-size: 1rem; font-weight: bold; border-radius: 5px; cursor: pointer; }
.yellow-action-btn { background: #ffcc00; border: 2px solid #000; padding: 10px; border-radius: 8px; font-weight: bold; font-size: 0.75rem; cursor: pointer; }
</style>