<script lang="ts">
	import { followedArtists, spotify } from "./stores"
	import type { Album, SimplifiedAlbum, SimplifiedTrack } from "./types"
	import { intersection } from "./utils"

	export let release: SimplifiedAlbum

	async function getReleaseTracks(): Promise<SimplifiedTrack[]> {
		const fullRelease: Album = (await $spotify.get(release.href)).data
		return fullRelease.tracks.items
	}

	async function playTrack(index: number) {
		await $spotify.put("me/player/play", {
			context_uri: release.uri,
			offset: {
				position: index,
			},
		})
	}
</script>

<div class="split">
	<img
		src={release.images[0].url}
		alt="Cover art of {release.name}"
		class="cover"
	/>
	<div class="content">
		<h2>{release.artists.map((a) => a.name).join(", ")}</h2>
		<h3>{release.name}</h3>

		{#if release.album_type === "compilation"}
			<table>
				{#await getReleaseTracks()}
					<tr>Loading tracks...</tr>
				{:then tracks}
					{#each tracks as track, index}
						<tr
							data-interesting={intersection(
								track.artists.map((a) => a.id),
								$followedArtists.map((a) => a.id)
							).length > 0}
							on:click={(e) => playTrack(index)}
						>
							<td class="artists"
								>{track.artists.map((a) => a.name).join(", ")}</td
							>
							<td class="name">{track.name}</td>
						</tr>
					{/each}
				{/await}
			</table>
		{:else}
			<ol>
				{#await getReleaseTracks()}
					<li>Loading tracks...</li>
				{:then tracks}
					{#each tracks as track, index}
						<li
							value={track.track_number}
							data-interesting={intersection(
								track.artists.map((a) => a.id),
								$followedArtists.map((a) => a.id)
							).length > 0}
							on:click={(e) => playTrack(index)}
						>
							{track.name}
							{#if track.artists.filter((a) => !release.artists
										.map((a) => a.id)
										.includes(a.id)).length > 1}
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
		{/if}

		<em class="release_date">Released {release.release_date}</em>
	</div>
</div>

<style>
	[data-interesting="false"] {
		opacity: 0.5;
	}
</style>
