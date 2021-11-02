<script lang="ts">
	import { library, spotify, analyses } from "../stores"
	import chunk from "lodash.chunk"
	import type { AudioFeatures, SavedTrack } from "../types"
	import ProgressBar from "@okrad/svelte-progressbar"
	import Heading from "../Heading.svelte"

	let progress: number = 0

	async function loadAnalyses(): Promise<void> {
		console.log($library)
		for (const tracks of chunk($library, 100)) {
			console.log("Analze", tracks)
			let analysesChunk: AudioFeatures[] = await $spotify.get(
				"/audio-features",
				{
					params: tracks.map(t => t.track.id),
				}
			)
			console.log(analysesChunk)
			analysesChunk.forEach(analysis => ($analyses[analysis.id] = analysis))
			progress = Object.keys($analyses).length / $library.length
		}
	}
</script>

<Heading>Morning playlist</Heading>

{#await loadAnalyses()}
	<div class="centered">
		<h2>Loading analyses of tracks</h2>
		<ProgressBar
			series={{
				perc: progress,
				color: "#53ffa5",
			}}
		/>
	</div>
{:then}
	<pre>
		{JSON.stringify($analyses, null, 2)}
	</pre>
{/await}
