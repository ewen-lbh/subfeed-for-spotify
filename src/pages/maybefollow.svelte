<script lang="ts">
	import ProgressBar from "@okrad/svelte-progressbar"
	import ArtistToFollow from "../ArtistToFollow.svelte"

	import Heading from "../Heading.svelte"
	import { spotify, library, followedArtists } from "../stores"
	import type {
		Paginated,
		SavedTrack,
		SimplifiedArtist,
		ArtistWithSavedTracks,
	} from "../types"

	type SimplifiedArtistWithSavedTracks = SimplifiedArtist & {
		savedTracks: SavedTrack[]
	}

	let totalSavedTracks = 0
	let artistsToFollow: ArtistWithSavedTracks[] = []

	$: artistsToFollow.sort(
		(a, b) => -(a.savedTracks.length - b.savedTracks.length)
	)

	// FIXME only works for ≤ 50 artists
	async function follow(...artists: SimplifiedArtist[]) {
		await $spotify.put(
			`me/following?type=artist&ids=${artists.map(a => a.id).join(",")}`
		)
		artistsToFollow = artistsToFollow.filter(
			a => !artists.map(a => a.id).includes(a.id)
		)
		window.localStorage.setItem(
			"artistsToFollow",
			JSON.stringify(artistsToFollow)
		)
	}

	async function loadArtistsToFollow(): Promise<ArtistWithSavedTracks[]> {
		const localStorageArtistsToFollow =
			window.localStorage.getItem("artistsToFollow")
		if (localStorageArtistsToFollow !== null) {
			artistsToFollow = JSON.parse(localStorageArtistsToFollow)
			//TODO re-check against currently followed artists here.
			// not as costly as re-checking all liked tracks, and way more relevant.
		} else {
			let paginatedSavedTracks: Paginated<SavedTrack> = (
				await $spotify.get("me/tracks?limit=50")
			).data

			if (paginatedSavedTracks === undefined) {
				throw new Error("Couldn't fetch the artists you follow")
			}

			let savedTracks: SavedTrack[] = paginatedSavedTracks.items
			totalSavedTracks = paginatedSavedTracks.total
			while (paginatedSavedTracks.next !== null) {
				let response = await $spotify.get(paginatedSavedTracks.next)
				paginatedSavedTracks = response.data
				savedTracks.push(...paginatedSavedTracks.items)
				$library = savedTracks
			}

			let artistsSavedTracks: SimplifiedArtistWithSavedTracks[] = []

			for (const entry of $library) {
				for (const artist of entry.track.artists) {
					if (!$followedArtists.map(a => a.id).includes(artist.id)) {
						if (artistsSavedTracks.map(a => a.id).includes(artist.id)) {
							artistsSavedTracks[
								artistsSavedTracks.map(a => a.id).indexOf(artist.id)
							].savedTracks.push(entry)
						} else {
							artistsSavedTracks.push({ ...artist, savedTracks: [entry] })
						}
					}
				}
			}

			for (const artist of artistsSavedTracks) {
				if (artist.savedTracks.length >= 5) {
					artistsToFollow.push({
						...(await $spotify.get(artist.href)).data,
						savedTracks: artist.savedTracks,
					})
				}
			}
			window.localStorage.setItem(
				"artistsToFollow",
				JSON.stringify(artistsToFollow)
			)
		}

		return artistsToFollow
	}
</script>

<Heading action="follow all" on:action={_ => follow(...artistsToFollow)}
	>Maybe follow those artists?</Heading
>

<!-- TODO reload button -->

{#await loadArtistsToFollow()}
	<div class="centered">
		<ProgressBar
			series={{
				perc:
					totalSavedTracks !== 0
						? Math.round(($library.length / totalSavedTracks) * 100)
						: 0,
				color: "#53ffa5",
			}}
		/>
	</div>
{:then}
	<ol>
		{#each artistsToFollow as artist}
			<li>
				<ArtistToFollow {artist} on:follow={_ => follow(artist)} />
			</li>
		{/each}
	</ol>
{:catch error}
	Sorry. {error.message}. Try reloading the page or logging out and logging back in.
{/await}

<style>
	ol {
		list-style: none;
		padding-left: 0;
	}
	li {
		margin-bottom: 6em;
	}
</style>
