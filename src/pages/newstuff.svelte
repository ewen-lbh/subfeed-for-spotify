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
			releases.push(
				...(await $spotify.get(`artists/${artist.id}/albums`)).data?.items
			)
			loadedArtists++
		}
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
			.slice(0, 25)
		return releases
	}

</script>

<Heading action="play all">New stuff for you</Heading>

{#await getReleases()}
	<div class="centerd">
		<ProgressBar
			series={totalArtists !== 0
				? Math.round((loadedArtists / totalArtists) * 100)
				: 0}
		/>
		<p>Loading...</p>
	</div>
{:then releases}
	<ol>
		{#each releases as release}
			<li id={release.id}>
				<Release {release} />
			</li>
		{/each}
	</ol>
{:catch error}
	<div class="centered">Sorry. {error.message}</div>
{/await}

<style>
	li {
		margin-bottom: 4em;
	}
	ol {
		list-style: none;
		padding-left: 0;
	}
</style>
