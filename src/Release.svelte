<script lang="ts">
	import { spotify } from "./stores";
	import type { Album, SimplifiedAlbum, SimplifiedTrack } from "./types";

	export let release: SimplifiedAlbum;

	async function getReleaseTracks(): Promise<SimplifiedTrack[]> {
		const fullRelease: Album = (await $spotify.get(release.href)).data;
		return fullRelease.tracks.items;
	}
</script>

<div class="split">
	<img
		src={release.images[0].url}
		alt="Cover art of {release.name}"
		class="cover"
	/>
	<div class="content">
		<h2>{release.artists[0].name}</h2>
		<h3>{release.name}</h3>

		<ol>
			{#await getReleaseTracks()}
				<li>Loading tracks...</li>
			{:then tracks}
				{#each tracks as track (track.track_number)}
					<li value={track.track_number}>
						{track.name}
						{#if track.artists.length > 1 }
							<span class="featuring"
								>&mdash; with {track.artists
									.filter((a) => a.name != release.artists[0].name)
									.map((a) => a.name)
									.join(", ")}</span
							>
						{/if}
					</li>
				{/each}
				{#if release.total_tracks > 50}
					<li class="more">More...</li>
				{/if}
			{/await}
		</ol>

		<em class="release_date">Released {release.release_date}</em>
	</div>
</div>
