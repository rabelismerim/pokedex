# ⚡ Pokédex App — Full Stack / Vue.js 🎮

> Uma aplicação web moderna e interativa inspirada no universo Pokémon, desenvolvida para explorar consumo de APIs REST, filtragem avançada de dados, paginação otimizada e gestão de estados fluidos.

---

## 🏛️ Arquitetura e Visão Geral

O projeto foi concebido com foco em **Clean Code**, componentização reutilizável e alta performance na renderização de dados. A aplicação consome dados públicos da [PokéAPI](https://pokeapi.co/) (ou de um backend próprio em Django, se aplicável), oferecendo uma experiência de utilizador (*UX*) fluida e responsiva.

---

## 🚀 Tecnologias Utilizadas

### **Frontend**
* **Vue 3** (Composition API com `<script setup>`)
* **Pinia** (Gestão de estado global para favoritos e histórico)
* **Axios** (Requisições HTTP otimizadas)
* **CSS3 / Tailwind CSS** (Design responsivo, modo escuro e animações dinâmicas)

### **Ferramentas e Ecossistema**
* **Vite** (Build tool de alta performance)
* **Git & GitHub** (Controlo de versão e documentação semântica)

---

## ✨ Principais Funcionalidades

* **Listagem Dinâmica e Paginação:** Visualização em grelha (*grid*) de centenas de Pokémon com carregamento rápido e transições suaves.
* **Pesquisa Inteligente e Filtros por Tipo:** Sistema de busca em tempo real por nome/ID e filtragem instantânea por elementos (Fogo, Água, Planta, Elétrico, etc.).
* **Modal de Detalhes Completo:** Informações detalhadas de cada Pokémon, incluindo estatísticas de combate (*Stats*), habilidades (*Abilities*) e barras de progresso visuais.
* **Sistema de Favoritos:** Funcionalidade para marcar e guardar Pokémon favoritos utilizando persistência local (`localStorage` / Pinia).
* **Design Responsivo:** Layout totalmente adaptado para dispositivos móveis, tablets e desktops.


