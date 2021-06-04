<script lang="ts">
	import IsolatedTrack from "./IsolatedTrack.svelte";
	import type { Artist, Track } from "spotify-api.js";
	import { savedTracks } from "./stores";

	export let artist: Artist;
	let likedTracks: Track[];
	savedTracks.subscribe((tracks) => {
		likedTracks = tracks.items
			.map((t) => t.track)
			.filter((t) => t.artists.includes(artist));
	});
</script>

<img src={artist.images[0].url} alt="{artist.name}'s profile picture" />

<span class="heading">{artist.name}</span>
<p class="why">
	you liked {likedTracks.length} track{likedTracks.length > 1 ? "s" : ""} from this
	artist
</p>

<ul class="tracks">
	{#each likedTracks as track}
		<li class="track">
			<IsolatedTrack {track} mainArtist={artist} />
		</li>
	{/each}
</ul>
