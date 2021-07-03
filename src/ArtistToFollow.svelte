<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import IsolatedTrack from "./IsolatedTrack.svelte"
	import type { ArtistWithSavedTracks } from "./types"
	const dispatch = createEventDispatcher()

	export let artist: ArtistWithSavedTracks

	let shownTracks = artist.savedTracks.slice(0, 7)
	let truncated = shownTracks.length < artist.savedTracks.length

	$: shownTracks = artist.savedTracks.slice(0, 7)
	$: truncated = shownTracks.length < artist.savedTracks.length
</script>

<div class="artist-to-follow">
	<a href={artist.external_urls.spotify}>
		<img
			class="artist"
			src={artist.images[0].url}
			alt="{artist.name}'s profile picture"
		/>
	</a>
	<div class="right">
		<div class="name-area">
			<a class="name" href={artist.external_urls.spotify}>{artist.name}</a>
			<button class="follow" on:click={_ => dispatch("follow")}>Follow</button>
		</div>

		<!-- TODO: ignore/dismiss button. implies storing a "ignored list" somewhere, and letting the user reset/edit that list. -->

		<p class="why">
			you liked <em>{artist.savedTracks.length}</em> track{artist.savedTracks
				.length > 1
				? "s"
				: ""} from this artist
		</p>

		<ul class="tracks">
			{#each shownTracks as entry}
				<li class="track">
					<IsolatedTrack track={entry.track} mainArtist={artist} />
				</li>
			{/each}
			{#if truncated}
				<li class="track has-more-indicator">& more</li>
			{/if}
		</ul>
	</div>
</div>

<style>
	.artist-to-follow {
		display: flex;
	}
	.right {
		width: 100%;
	}
	.name-area {
		display: flex;
		align-items: center;
	}
	button.follow {
		background: transparent;
		border: 2px solid black;
		border-radius: 0;
		font-family: IBM Plex Mono, monospace;
		font-weight: bold;
		margin: 0;
		margin-left: 1.5em;
		display: inline-block;
		font-size: 0.8em;
		height: 2.8em;
	}
	button.follow:hover {
		background: var(--primary);
		border-color: var(--primary);
		cursor: pointer;
	}
	.name {
		font-family: DM Serif Display, serif;
		font-size: 3em;
		color: black;
	}
	img.artist {
		width: 200px;
		height: 200px;
		clip-path: circle();
		margin-right: 2em;
		object-fit: cover;
	}
	.tracks {
		display: grid;
		grid-template-columns: 50% 50%;
		list-style: none;
		padding-left: 0;
		gap: 0.75em;
	}
	.tracks li {
		display: flex;
		align-items: center;
	}
	.why {
		margin-top: 0;
		font-style: italic;
		font-family: IBM Plex Mono, monospace;
	}

	.why em {
		color: var(--primary);
		font-weight: bold;
	}
	.tracks .has-more-indicator {
		font-family: IBM Plex Mono, monospace;
		display: flex;
		align-items: center;
		font-style: italic;
	}
	@media (max-width: 1000px) {
		.tracks {
			grid-template-columns: 100%;
		}
	}
</style>
