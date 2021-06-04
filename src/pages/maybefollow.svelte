<script lang="ts">
import type { Artist } from 'spotify-api.js';
import ArtistToFollow from '../ArtistToFollow.svelte';

	import Heading from '../Heading.svelte'
	
	let artists: Array<Artist> = []
</script>

<Heading action="follow all">Maybe follow those artists?</Heading>

{#each artists as artist}
	<ArtistToFollow {artist} />
{/each}
