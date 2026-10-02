<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const pokemons = ref([])
const selectedPokemon = ref(null)
const search = ref('')
const loading = ref(false)

const API_URL = 'http://127.0.0.1:8000/api/pokemons/'

// Efeito sonoro retrô usando Web Audio API (sem precisar carregar arquivo externo)
const playBeep = (freq = 600, type = 'sine', duration = 0.08) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    
    osc.type = type
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
    
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    
    osc.start()
    osc.stop(audioCtx.currentTime + duration)
  } catch (e) {
    // AudioContext não permitido sem interação prévia do usuário
  }
}

// Buscar Pokémons salvos no Django
const fetchPokemons = async () => {
  loading.value = true
  try {
    const res = await axios.get(API_URL)
    pokemons.value = res.data
    if (pokemons.value.length > 0 && !selectedPokemon.value) {
      selectedPokemon.value = pokemons.value[0]
    }
  } catch (err) {
    console.error('Erro ao carregar Pokémon:', err)
  } finally {
    loading.value = false
  }
}

// Chamar endpoint de seed
const seedDatabase = async () => {
  playBeep(400, 'square', 0.15)
  loading.value = true
  try {
    await axios.post(`${API_URL}seed/`, { limit: 151 })
    await fetchPokemons()
  } catch (err) {
    console.error('Erro ao popular dados:', err)
  } finally {
    loading.value = false
  }
}

// Favoritar/Desfavoritar
const toggleFavorite = async (pokemon) => {
  playBeep(800, 'sine', 0.1)
  try {
    const updated = !pokemon.is_favorite
    await axios.patch(`${API_URL}${pokemon.id}/`, { is_favorite: updated })
    pokemon.is_favorite = updated
  } catch (err) {
    console.error('Erro ao favoritar:', err)
  }
}

// Selecionar Pokémon
const selectPokemon = (poke) => {
  playBeep(700, 'sine', 0.05)
  selectedPokemon.value = poke
}

// Navegação
const nextPokemon = () => {
  if (!selectedPokemon.value || pokemons.value.length === 0) return
  playBeep(650, 'triangle', 0.06)
  const currentIndex = pokemons.value.findIndex(p => p.id === selectedPokemon.value.id)
  if (currentIndex < pokemons.value.length - 1) {
    selectedPokemon.value = pokemons.value[currentIndex + 1]
  }
}

const prevPokemon = () => {
  if (!selectedPokemon.value || pokemons.value.length === 0) return
  playBeep(550, 'triangle', 0.06)
  const currentIndex = pokemons.value.findIndex(p => p.id === selectedPokemon.value.id)
  if (currentIndex > 0) {
    selectedPokemon.value = pokemons.value[currentIndex - 1]
  }
}

// Filtro de busca por nome ou ID
const filteredPokemons = computed(() => {
  return pokemons.value.filter(p => 
    p.name.toLowerCase().includes(search.value.toLowerCase()) ||
    p.poke_id.toString().includes(search.value)
  )
})

onMounted(fetchPokemons)
</script>

<template>
  <div class="pokedex-body">
    <!-- LADO ESQUERDO DA POKÉDEX -->
    <div class="left-panel">
      <!-- Luzes/LEDs do topo -->
      <div class="top-lights">
        <div class="big-blue-light" :class="{ 'glowing': loading }">
          <div class="light-reflection"></div>
        </div>
        <div class="small-lights">
          <span class="light red"></span>
          <span class="light yellow"></span>
          <span class="light green"></span>
        </div>
      </div>

      <!-- Moldura da Tela Esquerda -->
      <div class="screen-container">
        <div class="screen-header">
          <span class="dot red-dot"></span>
          <span class="dot red-dot"></span>
        </div>
        
        <div class="main-screen">
          <div v-if="selectedPokemon" class="poke-display">
            <button class="fav-star" @click="toggleFavorite(selectedPokemon)">
              {{ selectedPokemon.is_favorite ? '⭐' : '☆' }}
            </button>
            <img :src="selectedPokemon.image_url" :alt="selectedPokemon.name" />
          </div>
          <div v-else class="empty-screen">
            <span>{{ loading ? 'Carregando...' : 'Nenhum Pokémon' }}</span>
          </div>
        </div>

        <div class="screen-footer">
          <div class="big-red-btn" @click="seedDatabase" title="Importar Pokémon"></div>
          <div class="speakers">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Controles do Lado Esquerdo -->
      <div class="controls">
        <button class="black-btn" @click="seedDatabase">IMPORTAR</button>
        <div class="pill-btns">
          <span class="pill red-pill" @click="playBeep(300)"></span>
          <span class="pill blue-pill" @click="playBeep(900)"></span>
        </div>
        <div class="dpad">
          <button class="dpad-btn up" @click="playBeep(600)"></button>
          <button class="dpad-btn right" @click="nextPokemon"></button>
          <button class="dpad-btn down" @click="playBeep(600)"></button>
          <button class="dpad-btn left" @click="prevPokemon"></button>
          <div class="dpad-center"></div>
        </div>
      </div>
    </div>

    <!-- HASTE CENTRAL DE DOBRADIÇA -->
    <div class="hinge">
      <div class="hinge-line"></div>
      <div class="hinge-line"></div>
    </div>

    <!-- LADO DIREITO DA POKÉDEX -->
    <div class="right-panel">
      <!-- Tela Verde de Informações -->
      <div class="green-screen">
        <div v-if="selectedPokemon" class="info-view">
          <div class="info-header">
            <h2>#{{ String(selectedPokemon.poke_id).padStart(3, '0') }} {{ selectedPokemon.name.toUpperCase() }}</h2>
          </div>
          <div class="types-list">
            <span class="badge" :class="selectedPokemon.primary_type">{{ selectedPokemon.primary_type }}</span>
            <span v-if="selectedPokemon.secondary_type" class="badge" :class="selectedPokemon.secondary_type">
              {{ selectedPokemon.secondary_type }}
            </span>
          </div>
        </div>
        
        <!-- Campo de Busca -->
        <div class="search-box">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Buscar por nome ou ID..." 
          />
        </div>

        <!-- Lista de Navegação Rápida -->
        <div class="pokemon-list-scroll">
          <div 
            v-for="poke in filteredPokemons" 
            :key="poke.id" 
            class="list-item"
            :class="{ active: selectedPokemon && selectedPokemon.id === poke.id }"
            @click="selectPokemon(poke)"
          >
            <span>#{{ String(poke.poke_id).padStart(3, '0') }} - {{ poke.name.toUpperCase() }}</span>
            <span v-if="poke.is_favorite">⭐</span>
          </div>
        </div>
      </div>

      <!-- Botões Teclado Numérico / Grid -->
      <div class="blue-grid-buttons">
        <div class="blue-btn" v-for="n in 10" :key="n" @click="playBeep(400 + n * 50)"></div>
      </div>

      <!-- Ações da Tela Direita -->
      <div class="right-controls">
        <div class="nav-arrows">
          <button class="arrow-btn" @click="prevPokemon">◀</button>
          <button class="arrow-btn" @click="nextPokemon">▶</button>
        </div>
        <div class="yellow-action-btn" @click="playBeep(1000, 'sine', 0.2)">
          POKÉDEX DATA
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.pokedex-body {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #1e1e24;
  padding: 30px;
  min-height: 100vh;
  font-family: 'Courier New', Courier, monospace;
}

/* LADO ESQUERDO */
.left-panel {
  width: 400px;
  background: #dc0a2d;
  border: 4px solid #8b0000;
  border-radius: 20px 0 0 20px;
  padding: 20px;
  box-shadow: -10px 10px 0px rgba(0,0,0,0.5);
}

/* Luzes Superiores */
.top-lights {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.big-blue-light {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 30% 30%, #00f0ff, #0088cc, #003366);
  border: 4px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 12px #00f0ff;
  position: relative;
  transition: transform 0.2s;
}

.big-blue-light.glowing {
  animation: pulse-glow 0.8s infinite alternate;
}

@keyframes pulse-glow {
  0% { box-shadow: 0 0 5px #00f0ff; transform: scale(0.98); }
  100% { box-shadow: 0 0 25px #00f0ff; transform: scale(1.05); }
}

.light-reflection {
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  position: absolute;
  top: 8px;
  left: 8px;
}

.small-lights {
  display: flex;
  gap: 8px;
}

.light {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #000;
}
.light.red { background: #ff0000; box-shadow: 0 0 5px #ff0000; }
.light.yellow { background: #ffcc00; box-shadow: 0 0 5px #ffcc00; }
.light.green { background: #00ff00; box-shadow: 0 0 5px #00ff00; }

/* Moldura da Tela */
.screen-container {
  background: #dedede;
  border: 3px solid #000;
  border-radius: 15px 15px 15px 40px;
  padding: 15px;
  box-shadow: inset -3px -3px 0px rgba(0,0,0,0.15);
}

.screen-header {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 50%;
}

.main-screen {
  background: #222;
  border: 3px solid #000;
  border-radius: 10px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.8);
}

.poke-display img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  filter: drop-shadow(0px 8px 8px rgba(0,0,0,0.6));
  transition: transform 0.2s ease-in-out;
}

.poke-display img:hover {
  transform: scale(1.08);
}

.fav-star {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  transition: transform 0.1s;
}

.fav-star:hover {
  transform: scale(1.2);
}

.fav-star:active {
  transform: scale(0.9);
}

.empty-screen {
  color: #00ff00;
}

.screen-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.big-red-btn {
  width: 25px;
  height: 25px;
  background: #ff0000;
  border: 2px solid #000;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 1px 2px 0px #000;
  transition: all 0.08s;
}

.big-red-btn:hover {
  background: #ff3333;
}

.big-red-btn:active {
  transform: translateY(2px);
  box-shadow: 0px 0px 0px #000;
}

.speakers span {
  display: block;
  width: 30px;
  height: 3px;
  background: #333;
  margin: 3px 0;
}

/* Controles */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.black-btn {
  background: #222;
  color: #fff;
  border: 2px solid #000;
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.75rem;
  box-shadow: 2px 3px 0px #000;
  transition: all 0.08s;
}

.black-btn:hover {
  background: #333;
}

.black-btn:active {
  transform: translate(2px, 3px);
  box-shadow: 0px 0px 0px #000;
}

.pill-btns {
  display: flex;
  gap: 10px;
}

.pill {
  width: 40px;
  height: 12px;
  border-radius: 10px;
  border: 1px solid #000;
  cursor: pointer;
  box-shadow: 1px 2px 0px #000;
  transition: all 0.08s;
}

.pill:hover {
  filter: brightness(1.2);
}

.pill:active {
  transform: translateY(2px);
  box-shadow: 0px 0px 0px #000;
}

.red-pill { background: #ff0000; }
.blue-pill { background: #0088cc; }

/* D-PAD Cross */
.dpad {
  width: 80px;
  height: 80px;
  position: relative;
}

.dpad-btn {
  position: absolute;
  background: #222;
  border: 1px solid #000;
  cursor: pointer;
  transition: background-color 0.1s;
}

.dpad-btn:hover {
  background: #444;
}

.dpad-btn:active {
  background: #000;
}

.dpad-btn.up { top: 0; left: 27px; width: 26px; height: 27px; border-radius: 4px 4px 0 0; }
.dpad-btn.down { bottom: 0; left: 27px; width: 26px; height: 27px; border-radius: 0 0 4px 4px; }
.dpad-btn.left { top: 27px; left: 0; width: 27px; height: 26px; border-radius: 4px 0 0 4px; }
.dpad-btn.right { top: 27px; right: 0; width: 27px; height: 26px; border-radius: 0 4px 4px 0; }
.dpad-center { position: absolute; top: 27px; left: 27px; width: 26px; height: 26px; background: #222; }

/* DOBRADIÇA CENTRAL */
.hinge {
  width: 30px;
  height: 480px;
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

/* LADO DIREITO */
.right-panel {
  width: 400px;
  background: #dc0a2d;
  border: 4px solid #8b0000;
  border-radius: 0 20px 20px 20px;
  padding: 20px;
  box-shadow: 10px 10px 0px rgba(0,0,0,0.5);
  margin-top: 40px;
}

/* Tela Verde da Direita */
.green-screen {
  background: #51ae5f;
  border: 3px solid #000;
  border-radius: 10px;
  padding: 12px;
  height: 250px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}

.info-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #000;
}

.types-list {
  display: flex;
  gap: 5px;
  margin-top: 4px;
}

.badge {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  border: 1px solid #000;
}

.badge.grass { background-color: #78c850; }
.badge.fire { background-color: #f08030; }
.badge.water { background-color: #6890f0; }
.badge.bug { background-color: #a8b820; }
.badge.normal { background-color: #a8a878; }
.badge.poison { background-color: #a040a0; }
.badge.electric { background-color: #f8d030; color: #000; }

.search-box input {
  width: 100%;
  padding: 6px;
  background: #a8dba8;
  border: 2px solid #000;
  border-radius: 5px;
  font-family: inherit;
  font-weight: bold;
  outline: none;
  transition: background 0.2s;
}

.search-box input:focus {
  background: #c8ecc8;
}

.pokemon-list-scroll {
  flex: 1;
  overflow-y: auto;
  background: #3b8347;
  border: 2px solid #000;
  border-radius: 5px;
  padding: 5px;
}

.list-item {
  padding: 5px 8px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #28572e;
  transition: background-color 0.15s;
}

.list-item:hover {
  background: #7ec288;
}

.list-item.active {
  background: #a8dba8;
  border-left: 4px solid #000;
}

/* Teclado Numérico Azul */
.blue-grid-buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  margin-top: 15px;
}

.blue-btn {
  height: 25px;
  background: #0088cc;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 1px 2px 0px #000;
  cursor: pointer;
  transition: all 0.08s;
}

.blue-btn:hover {
  background: #00aaff;
}

.blue-btn:active {
  transform: translate(1px, 2px);
  box-shadow: 0px 0px 0px #000;
}

/* Controles Inferiores */
.right-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.nav-arrows {
  display: flex;
  gap: 10px;
}

.arrow-btn {
  background: #e0e0e0;
  border: 2px solid #000;
  padding: 8px 15px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000;
  transition: all 0.08s;
}

.arrow-btn:hover {
  background: #ffffff;
}

.arrow-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #000;
}

.yellow-action-btn {
  background: #ffcc00;
  border: 2px solid #000;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.75rem;
  color: #000;
  box-shadow: 2px 2px 0px #000;
  cursor: pointer;
  transition: all 0.08s;
}

.yellow-action-btn:hover {
  background: #ffdd44;
}

.yellow-action-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #000;
}
</style>