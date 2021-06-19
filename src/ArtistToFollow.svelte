<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import IsolatedTrack from "./IsolatedTrack.svelte"
	import type { ArtistWithSavedTracks } from "./types"
	const dispatch = createEventDispatcher()

	export let artist: ArtistWithSavedTracks

</script>

<a href={artist.external_urls.spotify}>
	<img src={artist.images[0].url} alt="{artist.name}'s profile picture" />

	<p class="nam">{artist.name}</p>
</a>

<button on:click={(_) => dispatch("follow")}>Follow</button>
<!-- TODO: ignore/dismiss button. implies storing a "ignored list" somewhere, and letting the user reset/edit that list. -->

<p class="why">
	you liked {artist.savedTracks.length} track{artist.savedTracks.length > 1
		? "s"
		: ""} from this artist
</p>

<ul class="tracks">
	{#each artist.savedTracks as entry}
		<li class="track">
			<IsolatedTrack track={entry.track} mainArtist={artist} />
		</li>
	{/each}
</ul>
