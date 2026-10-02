from django.db import models

class Pokemon(models.Model):
    poke_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    primary_type = models.CharField(max_length=50)
    secondary_type = models.CharField(max_length=50, blank=True, null=True)
    image_url = models.URLField()
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return f"#{self.poke_id} - {self.name.capitalize()}"