<script lang="ts">
	import Heading from "../Heading.svelte"
	import Release from "../Release.svelte"
	import ProgressBar from "@okrad/svelte-progressbar"
	import { followedArtists, spotify } from "../stores"
	import type {
		CursorPaginated,
		SimplifiedAlbum,
		SimplifiedArtist,
	} from "../types"

	let loadedArtists = 0
	let totalArtists = 0

	async function getReleases() {
		let paginatedArtists: CursorPaginated<SimplifiedArtist> = (
			await $spotify.get("me/following?type=artist")
		).data?.artists

		if (paginatedArtists === undefined) {
			throw new Error("Couldn't fetch the artists you follow")
		}

		let artists: SimplifiedArtist[] = paginatedArtists.items
		totalArtists = paginatedArtists.total
		while (paginatedArtists.next !== null) {
			let response = await $spotify.get(paginatedArtists.next)
			paginatedArtists = response.data.artists
			artists.push(...paginatedArtists.items)
		}
		$followedArtists = artists

		let releases: SimplifiedAlbum[] = []
		for (const artist of artists) {
			let paginatedReleases: CursorPaginated<SimplifiedAlbum> = (
				await $spotify.get(
					`artists/${artist.id}/albums?limit=50&include_groups=album,single`
				)
			).data
			releases.push(...paginatedReleases.items)
			while (paginatedReleases.next !== null) {
				let response = await $spotify.get(paginatedReleases.next)
				paginatedReleases = response.data
				releases.push(...paginatedReleases.items)
			}
			loadedArtists++
		}
		console.log(releases)
		releases = releases
			.filter(r => r.available_markets.includes("FR"))
			.sort((a, b) =>
				a.release_date === b.release_date
					? a.id > b.id
						? 1
						: -1
					: a.release_date > b.release_date
					? 1
					: -1
			)
			.reverse()
			.slice(0, 50)
		return releases
	}
</script>

<Heading action="play all">New stuff for you</Heading>

{#await getReleases()}
	<div class="centered">
		<ProgressBar
			series={{
				perc:
					totalArtists !== 0
						? Math.round((loadedArtists / totalArtists) * 100)
						: 0,
				color: "#53ffa5",
			}}
		/>
		<p>Loading...</p>
	</div>
{:then releases}
	<ol>
		{#each releases as release}
			<li id={release.id}>
				<Release {release} />
			</li>
		{:else}
			<li>Nothing here.</li>
		{/each}
	</ol>
{:catch error}
	<p>
		Sorry. {error.message}. Try reloading the page or logging out and logging
		back in.
	</p>
{/await}

<style>
	li {
		margin-bottom: 4em;
	}
	ol {
		list-style: none;
		padding-left: 0;
	}
	.centered {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>
