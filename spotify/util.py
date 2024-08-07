from .models import spotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from .credential import CLIENT_ID, CLIENT_SECRET, BASE_URL

def get_user_tokens(session_id):
    user_tokens = spotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        print(user_tokens[0].expires_in)
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=(expires_in or 0))    
    if tokens:
        tokens.access_token = access_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.refresh_token = refresh_token
        tokens.save(update_fields=['access_token', 'token_type', 'expires_in', 'refresh_token'])
    else:
        token = spotifyToken(user=session_id, access_token=access_token, token_type=token_type, expires_in=expires_in, refresh_token=refresh_token)
        token.save()

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    print(tokens)
    if tokens:
        expiry = tokens.expires_in
        print(tokens.expires_in)
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False

def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()
    print
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')
    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    print(session_id, endpoint, post_, put_)
    tokens = get_user_tokens(session_id)
    headers = {'Content-Type': 'application/json',
               'Authorization': "Bearer " + tokens.access_token}

    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        putResponse = put(BASE_URL + endpoint, headers=headers)
        print("PUT Response",putResponse)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    
    try:
        return response.json()
    except Exception as e:
        return {'Error': 'Issue with request:', 'error_returned': e}
    
