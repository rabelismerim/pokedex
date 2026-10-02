🐍 Backend - Visão Geral & Instalação
O backend é uma API RESTful desenvolvida com Django e Django REST Framework (DRF). Ele é responsável por gerir a base de dados de Pokémons, integrar com a PokéAPI para importação de dados (seed) e fornecer endpoints para a listagem e alteração de favoritos.

Tecnologias do Backend:
Python 3.10+

Django Framework

Django REST Framework (DRF)

Django CORS Headers (para integração com o Vue.js)

Requests (para consumo de API externa)

SQLite (banco de dados)

📥 Como Instalar e Rodar o Backend
Aceda à pasta do backend:

Bash
cd backend
Crie e ative o ambiente virtual (.venv):

Bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux/macOS
python3 -m venv .venv
source .venv/bin/activate
Instale as dependências:

Bash
pip install -r requirements.txt
Execute as migrações da base de dados:

Bash
python manage.py migrate
Inicie o servidor de desenvolvimento:

Bash
python manage.py runserver
A API estará acessível em: [http://127.0.0.1:8000/api/pokemons/](http://127.0.0.1:8000/api/pokemons/)

🧪 Executar os Testes Automatizados
Para garantir que a API e as regras de negócio estão a funcionar corretamente:

Bash
python manage.py test
