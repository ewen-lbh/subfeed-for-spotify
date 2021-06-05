<script lang="ts">
	import Heading from '../Heading.svelte'
	import { spotify } from "../stores";

	spotify.subscribe(spotify => {
		console.log(spotify.get("me"))
	})
</script>

<Heading action="play all">New stuff for you</Heading>
