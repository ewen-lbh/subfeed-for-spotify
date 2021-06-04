# coding: utf-8
import json
from pathlib import Path
results = json.loads(Path('./results.json').read_text())

releases = {}
def pick(d, keys):
    return { k:v for k, v in d.items() if k in keys }

picked_keys = 'release_date images id name total_tracks album_type external_urls'.split(' ')
    
for artist, albums in results.items():
    releases[artist] = [ pick(r, picked_keys)  for r in albums if 'FR' in r['available_markets'] and r['release_date'].split('-')[0] == "2021" ]
     
import rich
from rich import print
from rich.table import Table
rs = []
for a, r in releases.items():
    rs += [ {'artist': a, **t} for t in r ]
rs.sort(key=lambda t: t['release_date'])
rs.reverse()
rs = [ r for r in rs if r['album_type'] != 'compilation' ]
releases_table = Table()
for k in picked_keys:
    releases_table.add_column(k)
for t in rs:
    releases_table.add_row([ json.dumps(t[k]) for k in picked_keys ])
