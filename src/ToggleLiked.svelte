<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import Icon from "./Icon.svelte"

	import { spotify } from "./stores"

	import type { SimplifiedTrack } from "./types"
	const dispatch = createEventDispatcher()

	export let track: SimplifiedTrack
	export let showLikeButton: boolean

	// FIXME only works for ≤ 50 tracks
	async function toggleLiked(...tracks: SimplifiedTrack[]) {
		const tracksToLike = tracks.filter(t => !t.is_saved)
		const tracksToDislike = tracks.filter(t => isAlreadyLiked(t))
		if (tracksToLike.length > 0) {
			await $spotify.put(
				`me/tracks?ids=${tracksToLike.map(t => t.id).join(",")}`
			)
		}
		if (tracksToDislike.length > 0) {
			await $spotify.delete(
				`me/tracks?ids=${tracksToDislike.map(t => t.id).join(",")}`
			)
		}
		for (const track of tracks) {
			dispatch("toggle", { id: track.id, saved: !track.is_saved })
		}
	}

	function isAlreadyLiked(track: SimplifiedTrack): boolean {
		return track?.is_saved || false
	}

</script>

<button
	title="Like this track"
	class="like" class:shown={showLikeButton}
	on:click|stopPropagation={_ => toggleLiked(track)}
	><Icon name="heart" outlined={!isAlreadyLiked(track)} /></button
>

<style>
	button {
		background: transparent;
		border: none;
		color: transparent;
		margin-bottom: 0;
		padding: 0;
	}
	button.shown {
		color: inherit;
	}
	button.shown:hover {
		cursor: pointer;
	}
</style>
