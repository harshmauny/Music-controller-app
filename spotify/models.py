from django.db import models

class spotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    token_type = models.CharField(max_length=50)
    access_token = models.CharField(max_length=200)
    refresh_token = models.CharField(max_length=200)
    expires_in = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
