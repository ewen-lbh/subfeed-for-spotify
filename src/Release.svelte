<script lang="ts">
	import { followedArtists, spotify } from "./stores"
	import type {
		Album,
		SimplifiedAlbum,
		SimplifiedArtist,
		SimplifiedTrack,
	} from "./types"
	import { intersection } from "./utils"
	import { onMount } from "svelte"
	import ToggleLiked from "./ToggleLiked.svelte"
	import Icon from "./Icon.svelte"

	export let release: SimplifiedAlbum

	let colors = {
		darkMuted: "",
		vibrant: "",
	}

	onMount(() => {
		extractColors()
	})

	let releaseTracks: SimplifiedTrack[] = []
	let hoveredTrack: number | null = null

	function followedArtistsIn(
		trackArtists: SimplifiedArtist[]
	): SimplifiedArtist[] {
		const ids = intersection(
			$followedArtists.map(a => a.id),
			trackArtists.map(a => a.id)
		)
		return ids.map(
			id => trackArtists.find(a => a.id === id) as SimplifiedArtist
		)
	}

	function featuredArtists(
		trackArtists: SimplifiedArtist[]
	): SimplifiedArtist[] {
		return trackArtists.filter(
			artist => !release.artists.map(a => a.id).includes(artist.id)
		)
	}

	async function extractColors() {
		const smallestImage = release.images.find(
			i =>
				i.height === Math.min(...release.images.map(i => i.height || Infinity))
		)
		if (smallestImage?.url !== null && smallestImage !== undefined) {
			const extractor = Vibrant.from(smallestImage.url)
			const swatches = await extractor.getSwatches()
			colors = {
				darkMuted: swatches.DarkMuted?.getHex() || "",
				vibrant:
					swatches.Vibrant?.getHsl()[1] >= 0.1
						? swatches.Vibrant?.getHex() || ""
						: "var(--primary)",
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

	async function enqueue(track: SimplifiedTrack) {
		await $spotify.post(`me/player/queue?uri=${track.uri}`)
	}
</script>

<div
	class="card"
	style="--dark-muted:{colors.darkMuted};--vibrant:{colors.vibrant}"
>
	<a href={release.external_urls.spotify} class="cover-link">
		<img
			src={release.images[0].url}
			alt="Cover art of {release.name}"
			class="cover"
		/>
	</a>
	<div class="content">
		<h2 class="artist">
			{#each release.artists as artist, idx}
				<a href={artist.external_urls.spotify}>{artist.name}</a>{idx !==
				release.artists.length - 1
					? ", "
					: ""}
			{/each}
		</h2>
		<a href={release.external_urls.spotify}
			><h3 class="title">{release.name}</h3></a
		>

		{#if release.album_type === "compilation" || release.artists[0].name === "Various Artists"}
			<table class="tracklist">
				{#await getReleaseTracks()}
					<tr>Loading tracks...</tr>
				{:then}
					{#each releaseTracks as track, index}
						<tr
							data-interesting={followedArtistsIn(track.artists).length > 0}
							on:click={e => playTrack(index)}
						>
							<td class="play-icon">
								<Icon name="play" />
							</td>
							<td class="artists"
								>{track.artists.map(a => a.name).join(", ")}</td
							>
							<td class="name">{track.name}</td>
						</tr>
					{/each}
				{/await}
			</table>
		{:else}
			<ol class="tracklist">
				{#await getReleaseTracks()}
					<li>Loading tracks...</li>
				{:then}
					{#each releaseTracks as track, index}
						<li
							value={track.track_number}
							id={track.id}
							data-interesting={followedArtistsIn(track.artists).length > 0}
							on:click={e => playTrack(index)}
							on:mouseover={e => (hoveredTrack = index)}
							on:mouseout={e => (hoveredTrack = null)}
						>
							{track.name}
							{#if featuredArtists(track.artists).length > 0}
								<span class="featuring"
									>&mdash; with {featuredArtists(track.artists)
										.map(a => a.name)
										.join(", ")}</span
								>
							{/if}
							<ToggleLiked
								{track}
								showLikeButton={hoveredTrack === index ||
									track.is_saved ||
									false}
								on:toggle={({ detail: { id, saved } }) =>
									(releaseTracks[
										releaseTracks.findIndex(t => t.id === id)
									].is_saved = saved)}
							/>
							<button
								class="enqueue"
								title="Add to the current queue"
								on:click|stopPropagation={_ => enqueue(track)}
								><Icon name="enqueue" /></button
							>
						</li>
					{/each}
					{#if release.total_tracks > 50}
						<li class="more">More...</li>
					{/if}
				{:catch err}
					<li class="errored">
						Sorry, {err.message}.
						<button on:click={_ => window.location.reload()}>Reload</button>
					</li>
				{/await}
			</ol>
		{/if}

		<em class="release-date">released {release.release_date}</em>
	</div>
</div>

<style>
	[data-interesting="false"] {
		opacity: 0.5;
	}

	li::marker,
	.title {
		color: var(--vibrant, var(--primary));
		transition: color 2s ease;
	}

	li::marker {
		font-weight: bold;
	}

	li:hover,
	tr:hover {
		cursor: pointer;
	}

	li:hover::marker {
		content: " ";
		font-family: "Material Icons Outlined";
	}
	tr:hover td.play-icon {
		opacity: 1;
	}

	tr td.play-icon {
		opacity: 0;
	}

	li,
	tr {
		margin-bottom: 0.25em;
	}

	.card {
		display: grid;
		grid-template-columns: min(300px, 25vw) 1fr;
		background: #151515;
		color: white;
	}

	.cover {
		width: 25vw;
		height: 25vw;
		object-fit: cover;
		max-width: 300px;
		max-height: 300px;
	}

	.content {
		padding: 1.5em;
		display: flex;
		flex-direction: column;
		min-height: calc(min(300px, 25vw) - 2 * 1.5em);
	}

	.tracklist,
	.title {
		font-family: IBM Plex Mono, monospace;
		margin-top: 0;
	}

	.tracklist tr:hover,
	.tracklist li:hover {
		color: var(--vibrant);
	}

	.title {
		font-size: 1.5em;
		font-weight: normal;
	}

	.featuring {
		opacity: 0.5;
	}

	.artist {
		font-family: DM Serif Display, serif;
		margin-top: 0;
		margin-bottom: 0.25em;
		font-size: 2em;
		font-weight: normal;
		line-height: 1;
	}

	.artist a {
		color: white;
		font-size: 1.5em;
	}

	.release-date {
		justify-self: flex-end;
		align-self: flex-end;
		display: block;
		margin-top: auto;
		font-family: IBM Plex Mono, monospace;
		font-weight: normal;
		opacity: 0.5;
	}

	button.enqueue {
		background: transparent;
		border: none;
		padding: 0;
		margin-bottom: 0;
		opacity: 0;
		cursor: pointer;
		font-weight: bold;
		line-height: 1;
		font-size: 1.2em;
	}
	.tracklist li:hover button.enqueue {
		opacity: 1;
		color: var(--vibrant);
	}

	@media (max-width: 700px) {
		.card {
			grid-template-columns: 1fr;
			grid-template-rows: min(25vh, 300px) 1fr;
		}
		.cover {
			width: 25vh;
			height: 25vh;
		}
		.cover-link {
			display: flex;
			justify-content: center;
		}
	}
</style>
