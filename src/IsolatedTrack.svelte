<script lang="ts">
	import type { Track, Artist } from "./types"

	export let mainArtist: Artist
	export let track: Track

</script>

<!-- TODO button to play track (in the artist context?) -->

<div class="split">
	<img src={track.album.images[0].url} alt="{track.album.name}'s cover art" />
	<p class="title">
		<a href={track.external_urls.spotify}>{track.name}</a>
		{#if track.artists.length > 1}
			<span class="featuring"
				>— with {#each track.artists.filter((a) => a.id != mainArtist.id) as artist, idx}
					<a href={artist.external_urls.spotify}>{artist.name}</a>{idx !==
					track.artists.filter((a) => a.id != mainArtist.id).length - 1
						? ", "
						: ""}
				{/each}
			</span>
		{/if}
	</p>
</div>
