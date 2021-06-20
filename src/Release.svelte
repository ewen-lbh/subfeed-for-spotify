<script lang="ts">
	import { followedArtists, spotify } from "./stores"
	import type { Album, SimplifiedAlbum, SimplifiedTrack } from "./types"
	import { intersection } from "./utils"
	import { onMount } from "svelte"
	import Icon from "./Icon.svelte"
	import ToggleLiked from "./ToggleLiked.svelte"

	export let release: SimplifiedAlbum

	let colors  = {
		darkMuted: "",
		vibrant: ""
	}

	onMount(() => {
		extractColors()
	})

	let releaseTracks: SimplifiedTrack[] = []

	async function extractColors() {
		const smallestImage = 
			release.images.find(
				(i) =>
					i.height ===
					Math.min(...release.images.map((i) => i.height || Infinity))
			)
		if (smallestImage?.url !== null && smallestImage !== undefined) {
			const extractor = Vibrant.from(smallestImage.url)
			const swatches = await extractor.getSwatches()
			colors = {
				darkMuted: swatches.DarkMuted?.getHex() || "",
				vibrant: swatches.Vibrant?.getHex() || "",
			}
		}
	}

	async function getReleaseTracks() {
		const fullRelease: Album = (await $spotify.get(release.href)).data
		const savedStatuses: boolean[] = (
			await $spotify.get(
				`me/tracks/contains?ids=${fullRelease.tracks.items
					.map(t => t.id)
					.join(",")}`
			)
		).data
		for (const [i, _] of fullRelease.tracks.items.entries()) {
			fullRelease.tracks.items[i].is_saved = savedStatuses[i] || false
		}
		releaseTracks = fullRelease.tracks.items
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

<div class="split" style="--dark-muted:{colors.darkMuted};--vibrant:{colors.vibrant}">
	<a href={release.external_urls.spotify}>
		<img
			src={release.images[0].url}
			alt="Cover art of {release.name}"
			class="cover"
		/>
	</a>
	<div class="content">
		<h2>
			{#each release.artists as artist, idx}
				<a href={artist.external_urls.spotify}>{artist.name}</a>{idx !==
				release.artists.length - 1
					? ", "
					: ""}
			{/each}
		</h2>
		<a href={release.external_urls.spotify}><h3>{release.name}</h3></a>

		{#if release.album_type === "compilation"}
			<table>
				{#await getReleaseTracks()}
					<tr>Loading tracks...</tr>
				{:then}
					{#each releaseTracks as track, index}
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
				{:then}
					{#each releaseTracks as track, index}
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
							<ToggleLiked
								{track}
								on:toggle={({ detail: { id, saved } }) =>
									(releaseTracks[
										releaseTracks.findIndex(t => t.id === id)
									].is_saved = saved)}
							/>
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

	li::marker {
		color: var(--vibrant);
	}

</style>
