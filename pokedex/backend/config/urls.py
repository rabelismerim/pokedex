from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from pokemon.views import PokemonViewSet

router = DefaultRouter()
router.register(r'pokemons', PokemonViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]