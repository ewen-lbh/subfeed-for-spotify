from spotipy import SpotifyOAuth, CacheFileHandler, Spotify
import json

auth = SpotifyOAuth(
    client_id="473502f1844341978712580b1db507c2",
    client_secret="8581e266ac2946b1be58d82f82268c22",
    scope="user-follow-read user-library-read user-library-modify playlist-modify-private",
    open_browser=True,
    redirect_uri="http://localhost:8081",
    cache_handler=CacheFileHandler(
        cache_path="/home/ewen/.cache/spotifydash/cache.json"
    ),
)
spotify = Spotify(auth_manager=auth)


def unwrap_paging(fetch, select=lambda wrapped: wrapped.get("items", [])):
    wrapped = fetch()
    items = select(wrapped)
    while wrapped.get("next", False):
        wrapped = spotify.next(wrapped)
        items += select(wrapped)
    return items


followed_artists = unwrap_paging(
    fetch=lambda: spotify.current_user_followed_artists()["artists"],
)

newstuff = dict()

for artist in followed_artists:
    newstuff[artist["name"]] = unwrap_paging(lambda: spotify.artist_albums(artist_id=artist["id"]))

print(json.dumps(newstuff))
