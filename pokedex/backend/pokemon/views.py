import requests
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Pokemon
from .serializers import PokemonSerializer

class PokemonViewSet(viewsets.ModelViewSet):
    queryset = Pokemon.objects.all().order_by('poke_id')
    serializer_class = PokemonSerializer

    # Endpoint customizado para popular o banco com os primeiros N Pokémon
    @action(detail=False, methods=['post'])
    def seed(self, request):
        limit = request.data.get('limit', 20)
        response = requests.get(f'https://pokeapi.co/api/v2/pokemon?limit={limit}')
        data = response.json()

        imported_count = 0
        for item in data['results']:
            poke_detail = requests.get(item['url']).json()
            poke_id = poke_detail['id']
            
            if not Pokemon.objects.filter(poke_id=poke_id).exists():
                types = [t['type']['name'] for t in poke_detail['types']]
                p_type = types[0]
                s_type = types[1] if len(types) > 1 else None
                img = poke_detail['sprites']['other']['official-artwork']['front_default']

                Pokemon.objects.create(
                    poke_id=poke_id,
                    name=poke_detail['name'],
                    primary_type=p_type,
                    secondary_type=s_type,
                    image_url=img or ""
                )
                imported_count += 1

        return Response({"message": f"{imported_count} Pokémon importados com sucesso!"}, status=status.HTTP_201_CREATED)