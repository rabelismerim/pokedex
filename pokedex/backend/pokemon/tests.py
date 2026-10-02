from unittest.mock import patch, MagicMock
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Pokemon


class PokemonAPITests(APITestCase):

    def setUp(self):
        """Cria dados iniciais para os testes de API"""
        self.pokemon1 = Pokemon.objects.create(
            poke_id=1,
            name="bulbasaur",
            primary_type="grass",
            secondary_type="poison",
            image_url="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            is_favorite=False
        )
        self.pokemon2 = Pokemon.objects.create(
            poke_id=4,
            name="charmander",
            primary_type="fire",
            secondary_type=None,
            image_url="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
            is_favorite=True
        )

    def test_list_pokemons(self):
        """Testa o endpoint GET /api/pokemons/"""
        url = reverse('pokemon-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], self.pokemon1.name)

    def test_toggle_favorite(self):
        """Testa a atualização do status de favorito via PATCH"""
        url = reverse('pokemon-detail', kwargs={'pk': self.pokemon1.id})
        payload = {'is_favorite': True}

        response = self.client.patch(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pokemon1.refresh_from_db()
        self.assertTrue(self.pokemon1.is_favorite)

    @patch('requests.get')
    def test_seed_pokemons_success(self, mock_get):
        """Testa a importação de dados mockando a requisição à PokeAPI externa"""
        # Resposta simulada para a lista
        mock_list_res = MagicMock()
        mock_list_res.status_code = 200
        mock_list_res.json.return_value = {
            "results": [
                {"name": "squirtle", "url": "https://pokeapi.co/api/v2/pokemon/7/"}
            ]
        }

        # Resposta simulada para o detalhe
        mock_detail_res = MagicMock()
        mock_detail_res.status_code = 200
        mock_detail_res.json.return_value = {
            "id": 7,
            "name": "squirtle",
            "types": [
                {"type": {"name": "water"}}
            ],
            "sprites": {
                "other": {
                    "official-artwork": {
                        "front_default": "https://raw.githubusercontent.com/.../7.png"
                    }
                }
            }
        }

        # Configura as chamadas em sequência de requests.get
        mock_get.side_effect = [mock_list_res, mock_detail_res]

        url = reverse('pokemon-seed')
        response = self.client.post(url, {'limit': 1}, format='json')

        # Aceita 201 Created ou 200 OK
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        self.assertTrue(Pokemon.objects.filter(poke_id=7).exists())


class PokemonModelTests(APITestCase):

    def test_pokemon_str_representation(self):
        """Testa o método __str__ do modelo Pokemon"""
        poke = Pokemon.objects.create(
            poke_id=25,
            name="Pikachu",
            primary_type="electric"
        )
        self.assertEqual(str(poke), f"#{poke.poke_id} - {poke.name}")