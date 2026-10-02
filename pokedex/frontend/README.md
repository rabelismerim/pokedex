# 🔴 Pokédex Full Stack (Django REST + Vue 3 + Pinia)

Uma aplicação Full Stack que recria a experiência clássica da **Pokédex do anime Pokémon**, combinando um backend robusto em Python/Django com um frontend reativo e estilizado em Vue 3.

![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-State_Management-yellow?style=for-the-badge)
![Django REST](https://img.shields.io/badge/Django_REST_Framework-3.x-red?style=for-the-badge&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)

---

## 🚀 Funcionalidades e Destaques

- 🔊 **Voz da Pokédex (Web Speech API):** Narração automática dos dados do Pokémon selecionado, ajustada para reproduzir o tom robótico do anime e com **tradução dinâmica dos tipos para português** (ex: *Charmander. Pokémon do tipo Fogo*).
- 🎵 **Efeitos Sonoros Web Audio API:** Sons sintéticos acionados por código nos botões do painel e no D-Pad.
- 🔍 **Filtros e Busca em Tempo Real:** Pesquisa por nome ou número do ID, filtro por tipos com suporte a *chips* de interface e visualização apenas de favoritos.
- ⭐ **Favoritos Persistidos:** Marque e desmarque Pokémons favoritos com persistência via requisição `PATCH` ao backend.
- ⚡ **Seed de Dados Automatizado:** Integração com a [PokéAPI](https://pokeapi.co/) para popular o banco de dados via endpoint REST.
- 📐 **Interface Componentizada:** Layout responsivo construído em CSS puro com arquitetura em dois painéis dobráveis (LeftPanel e RightPanel) e gerenciamento de estado via **Pinia**.
- 🧪 **Testes Unitários Automatizados:** Suíte de testes no backend usando `APITestCase` com *mocking* de requisições externas.

---

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **Python 3.10+**
- **Django** & **Django REST Framework (DRF)**
- **SQLite** (banco de dados padrão para desenvolvimento)
- **Requests** (para comunicação com a PokéAPI externa)

### **Frontend**
- **Vue 3** (Composition API `<script setup>`)
- **Pinia** (Gerenciamento de Estado Global)
- **Axios** (Cliente HTTP)
- **Web Speech API & Web Audio API** (Recursos nativos do navegador para voz e efeitos sonoros)

---

## 📁 Estrutura do Projeto

```text
pokedex/
├── backend/
│   ├── manage.py
│   ├── db.sqlite3
│   └── pokemon/
│       ├── models.py      # Modelo do Pokémon
│       ├── serializers.py # Serializadores REST
│       ├── views.py       # Endpoints (List, Detail, Seed)
│       └── tests.py       # Testes unitários com APITestCase e Mocks
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.vue
        ├── main.js
        ├── stores/
        │   └── usePokemonStore.js # Gerenciamento de estado e regras de voz/som
        └── components/
            ├── LeftPanel.vue      # Tela principal, luzes e controles D-Pad
            └── RightPanel.vue     # Lista de seleção, busca e filtros por tipo