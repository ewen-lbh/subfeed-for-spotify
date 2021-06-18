<script lang="ts">
	import ProgressBar from "@okrad/svelte-progressbar";
	import ArtistToFollow from "../ArtistToFollow.svelte";

	import Heading from "../Heading.svelte";
	import { spotify, library, followedArtists } from "../stores";
	import type {
		Artist,
		Paginated,
		SavedTrack,
		SimplifiedArtist,
		ArtistWithSavedTracks,
	} from "../types";

	type SimplifiedArtistWithSavedTracks = SimplifiedArtist & {
		savedTracks: SavedTrack[];
	};

	let totalSavedTracks = 0;

	async function loadArtistsToFollow(): Promise<ArtistWithSavedTracks[]> {
		let artistsToFollow: Array<ArtistWithSavedTracks> = [];
		if (window.localStorage.getItem("artistsToFollow") !== null) {
			artistsToFollow = JSON.parse(
				window.localStorage.getItem("artistsToFollow")
			);
		} else {
			let paginatedSavedTracks: Paginated<SavedTrack> = (
				await $spotify.get("me/tracks?limit=50")
			).data;

			if (paginatedSavedTracks === undefined) {
				throw new Error("Couldn't fetch the artists you follow");
			}

			let savedTracks: SavedTrack[] = paginatedSavedTracks.items;
			totalSavedTracks = paginatedSavedTracks.total;
			while (paginatedSavedTracks.next !== null) {
				let response = await $spotify.get(paginatedSavedTracks.next);
				paginatedSavedTracks = response.data;
				savedTracks.push(...paginatedSavedTracks.items);
				$library = savedTracks;
			}

			let artistsSavedTracks: SimplifiedArtistWithSavedTracks[] = [];

			for (const entry of $library) {
				for (const artist of entry.track.artists) {
					if (!$followedArtists.map((a) => a.id).includes(artist.id)) {
						if (artistsSavedTracks.map((a) => a.id).includes(artist.id)) {
							artistsSavedTracks[
								artistsSavedTracks.map((a) => a.id).indexOf(artist.id)
							].savedTracks.push(entry);
						} else {
							artistsSavedTracks.push({ ...artist, savedTracks: [entry] });
						}
					}
				}
			}

			for (const artist of artistsSavedTracks) {
				if (artist.savedTracks.length >= 5) {
					artistsToFollow.push({
						...(await $spotify.get(artist.href)).data,
						savedTracks: artist.savedTracks,
					});
				}
			}
			window.localStorage.setItem(
				"artistsToFollow",
				JSON.stringify(artistsToFollow)
			);
		}
		artistsToFollow = artistsToFollow.sort(a => a.savedTracks.length)

		return artistsToFollow;
	}
</script>

<Heading action="follow all">Maybe follow those artists?</Heading>

{#await loadArtistsToFollow()}
	<div class="centered">
		<ProgressBar
			series={totalSavedTracks !== 0
				? Math.round(($library.length / totalSavedTracks) * 100)
				: 0}
		/>
	</div>
{:then artists}
	{#each artists as artist}
		<ArtistToFollow {artist} />
	{/each}
{:catch error}
	Sorry. {error.message}.
{/await}
