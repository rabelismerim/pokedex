import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api/pokemons/'

// Dicionário para tradução dos tipos apenas na narração em áudio
const typeTranslations = {
  grass: 'Grama',
  fire: 'Fogo',
  water: 'Água',
  bug: 'Inseto',
  normal: 'Normal',
  poison: 'Venenoso',
  electric: 'Elétrico',
  ground: 'Terra',
  fairy: 'Fada',
  fighting: 'Lutador',
  psychic: 'Psíquico',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  ice: 'Gelo',
  steel: 'Aço',
  flying: 'Voador',
  dark: 'Sombrio'
}

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [],
    selectedPokemon: null,
    search: '',
    selectedType: '',
    showOnlyFavorites: false,
    loading: false,
    isMuted: false,
    pokemonTypes: [
      'grass', 'fire', 'water', 'bug', 'normal', 
      'poison', 'electric', 'ground', 'fairy', 'fighting', 
      'psychic', 'rock', 'ghost', 'dragon', 'ice', 'steel', 'flying', 'dark'
    ]
  }),

  getters: {
    filteredPokemons(state) {
      return state.pokemons.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(state.search.toLowerCase()) ||
                              p.poke_id.toString().includes(state.search)
        
        const matchesType = !state.selectedType || 
                            p.primary_type === state.selectedType || 
                            p.secondary_type === state.selectedType
                            
        const matchesFav = !state.showOnlyFavorites || p.is_favorite

        return matchesSearch && matchesType && matchesFav
      })
    }
  },

  actions: {
    playBeep(freq = 600, type = 'sine', duration = 0.08) {
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
        // Ignora caso o áudio não esteja liberado pelo usuário ainda
      }
    },

    speakPokemonData(pokemon) {
      if (this.isMuted || !('speechSynthesis' in window) || !pokemon) return

      window.speechSynthesis.cancel() // Interrompe qualquer fala anterior imediatamente

      // Tradução dos tipos de inglês para português
      const primaryTypePt = typeTranslations[pokemon.primary_type?.toLowerCase()] || pokemon.primary_type
      const secondaryTypePt = pokemon.secondary_type 
        ? typeTranslations[pokemon.secondary_type?.toLowerCase()] || pokemon.secondary_type 
        : null

      // Montagem da frase no padrão Pokédex
      let text = `${pokemon.name}. Pokémon do tipo ${primaryTypePt}.`
      if (secondaryTypePt) {
        text = `${pokemon.name}. Pokémon do tipo ${primaryTypePt} e ${secondaryTypePt}.`
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'pt-BR'

      // Configurações de pitch e rate para reproduzir o tom robótico do anime
      utterance.pitch = 0.8  // Tom ligeiramente mais grave/metálico
      utterance.rate = 1.1   // Cadência levemente rápida e firme

      // Seleção de voz nativa em Português do Brasil
      const voices = window.speechSynthesis.getVoices()
      const ptVoice = voices.find(voice => voice.lang.includes('pt-BR') || voice.lang.includes('pt'))
      if (ptVoice) {
        utterance.voice = ptVoice
      }

      window.speechSynthesis.speak(utterance)
    },

    toggleMute() {
      this.isMuted = !this.isMuted
      if (this.isMuted) {
        window.speechSynthesis.cancel()
      } else if (this.selectedPokemon) {
        this.speakPokemonData(this.selectedPokemon)
      }
    },

    async fetchPokemons() {
      this.loading = true
      try {
        const res = await axios.get(API_URL)
        this.pokemons = res.data
        if (this.pokemons.length > 0 && !this.selectedPokemon) {
          this.selectedPokemon = this.pokemons[0]
          this.speakPokemonData(this.pokemons[0])
        }
      } catch (err) {
        console.error('Erro ao carregar Pokémon:', err)
      } finally {
        this.loading = false
      }
    },

    async seedDatabase() {
      this.playBeep(400, 'square', 0.15)
      this.loading = true
      try {
        await axios.post(`${API_URL}seed/`, { limit: 151 })
        await this.fetchPokemons()
      } catch (err) {
        console.error('Erro ao popular dados:', err)
      } finally {
        this.loading = false
      }
    },

    async toggleFavorite(pokemon) {
      this.playBeep(800, 'sine', 0.1)
      try {
        const updated = !pokemon.is_favorite
        await axios.patch(`${API_URL}${pokemon.id}/`, { is_favorite: updated })
        pokemon.is_favorite = updated
      } catch (err) {
        console.error('Erro ao favoritar:', err)
      }
    },

    selectPokemon(poke) {
      this.playBeep(700, 'sine', 0.05)
      this.selectedPokemon = poke
      this.speakPokemonData(poke)
    },

    nextPokemon() {
      if (!this.selectedPokemon || this.filteredPokemons.length === 0) return
      this.playBeep(650, 'triangle', 0.06)
      const currentIndex = this.filteredPokemons.findIndex(p => p.id === this.selectedPokemon.id)
      if (currentIndex < this.filteredPokemons.length - 1) {
        this.selectedPokemon = this.filteredPokemons[currentIndex + 1]
        this.speakPokemonData(this.selectedPokemon)
      }
    },

    prevPokemon() {
      if (!this.selectedPokemon || this.filteredPokemons.length === 0) return
      this.playBeep(550, 'triangle', 0.06)
      const currentIndex = this.filteredPokemons.findIndex(p => p.id === this.selectedPokemon.id)
      if (currentIndex > 0) {
        this.selectedPokemon = this.filteredPokemons[currentIndex - 1]
        this.speakPokemonData(this.selectedPokemon)
      }
    }
  }
})

// Listener global para pré-carregar as vozes do navegador
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices()
  }
}