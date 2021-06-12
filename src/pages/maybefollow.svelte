<script lang="ts">
import ArtistToFollow from '../ArtistToFollow.svelte';

	import Heading from '../Heading.svelte'
</script>

<Heading action="follow all">Maybe follow those artists?</Heading>

{#each artists as artist}
	<ArtistToFollow/>
{/each}
