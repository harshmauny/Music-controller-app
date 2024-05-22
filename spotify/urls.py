from django.urls import path
from .views import AuthURL, SpotifyCallback, IsAuthenticated, CurrentSong

urlpatterns = [
    path('get-auth-url/', AuthURL.as_view() ),
    path('redirect/', SpotifyCallback.as_view() ),
    path('is-authenticated/', IsAuthenticated.as_view()),
    path('current-song/', CurrentSong.as_view())
]