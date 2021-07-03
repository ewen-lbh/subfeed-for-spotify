<script lang="ts">
import Icon from "./Icon.svelte";
import { spotify } from "./stores";

	import type { Track, Artist } from "./types"

	export let mainArtist: Artist
	export let track: Track

	async function play(track: Track) {
		$spotify.put("me/player/play", {
			context_uri: track.album.uri,
			offset: {
				position: track.track_number - 1
			}
		})
	}
</script>

<!-- TODO button to play track (in the artist context?) -->

<div class="track">
	<button class="play" on:click={_ => play(track)}><Icon name="play"></Icon></button>
	<img src={track.album.images[0].url} alt="{track.album.name}'s cover art" />
	<p class="title">
		<a href={track.external_urls.spotify} title={`from ${track.album.name}`}>{track.name}</a>
		{#if track.artists.length > 1}
			<span class="featuring"
				>— with {#each track.artists.filter(a => a.id != mainArtist.id) as artist, idx}
					<a href={artist.external_urls.spotify}>{artist.name}</a>{idx !==
					track.artists.filter(a => a.id != mainArtist.id).length - 1
						? ", "
						: ""}
				{/each}
			</span>
		{/if}
	</p>
</div>

<style>
	.track {
		display: flex;
		align-items: center;
		position: relative;
	}
	.play {
		position: absolute;
		margin-bottom: 0;
		font-size: 2em;
		background: rgba(0, 0, 0, 0.25);
		border: none;
		padding: 0.25em;
		color: white;
		cursor: pointer;
	}
	.track:not(:hover) .play {
		opacity: 0;
		background: transparent;
	}
	img, .play {
		width: 50px;
		height: 50px;
	}
	.title {
		font-family: IBM Plex Mono, monospace;
		padding-left: 1em;
	}
	.featuring {
		opacity: 0.5;
	}
	a {
		color: black;
	}
</style>
