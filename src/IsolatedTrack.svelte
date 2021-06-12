<script lang="ts">
import type { Track, Artist } from "./types";

	export let mainArtist: Artist;
	export let track: Track;
</script>

<div class="split">
	<img src={track.album.images[0].url} alt="{track.album.name}'s cover art" />
	<p class="title">
		{track.name}
		{#if track.artists.length > 1}
			<span class="featuring"
				>— with {track.artists.filter((a) => a.id != mainArtist.id).map(a => a.name).join(", ")}</span
			>
		{/if}
	</p>
</div>
