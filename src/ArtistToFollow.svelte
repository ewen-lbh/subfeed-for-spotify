<script lang="ts">
	import IsolatedTrack from "./IsolatedTrack.svelte";
	import { library } from "./stores";
	import type { ArtistWithSavedTracks } from "./types";

	export let artist: ArtistWithSavedTracks;
</script>

<img src={artist.images[0].url} alt="{artist.name}'s profile picture" />

<span class="heading">{artist.name}</span>
<p class="why">
	you liked {artist.savedTracks.length} track{artist.savedTracks.length > 1 ? "s" : ""} from this
	artist
</p>

<ul class="tracks">
	{#each artist.savedTracks as entry}
		<li class="track">
			<IsolatedTrack track={entry.track} mainArtist={artist} />
		</li>
	{/each}
</ul>
