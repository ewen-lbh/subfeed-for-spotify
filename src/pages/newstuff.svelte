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
	let releases: SimplifiedAlbum[] = []
	let loadedStuff: string[] = []

	function addLoadedStuff(...stuff: string[]) {
		loadedStuff = [
			...loadedStuff,
			...stuff.map(item => item.slice(0, 50)),
		].filter((val, idx, arr) => arr.indexOf(val) === idx)
		let pre = document.getElementById("loaded-stuff") as HTMLPreElement
		pre.scrollBy({
			behavior: "smooth",
			top: pre.scrollHeight - pre.clientHeight,
		})
	}

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
			addLoadedStuff(...paginatedArtists.items.map(a => "artist " + a.name))
			artists.push(...paginatedArtists.items)
		}
		$followedArtists = artists

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
				addLoadedStuff(...paginatedReleases.items.map(r => `release ${r.name}`))
			}
			addLoadedStuff(`releases by ${artist.name}`)
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

<Heading>New stuff for you</Heading>

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
		<pre
			id="loaded-stuff">{loadedStuff.map(l => `Loaded ${l}`).join("\n")}</pre>
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

	.centered pre {
		max-height: 50vh;
		width: 100ch;
		overflow-y: scroll;
		text-align: left;
	}

	@media (min-width: 1500px) {
		.centered pre {
			max-height: 70vh;
		}
	}
</style>
