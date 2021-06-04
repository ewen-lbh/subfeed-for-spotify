<script lang="ts">
	import Icon from "./Icon.svelte";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	import { spotify } from "./stores";

	export let current: string;
	let disabled: boolean;
	spotify.subscribe((client) => (disabled = client === null));
</script>

<nav>
	<button
		on:click={(e) => dispatch("navigate", "newstuff")}
		class={current == "newstuff" ? "current" : ""}
		{disabled}
	>
		newstuff <button on:click={(e) => dispatch("play-all-newstuff")}
			><Icon name="play" /></button
		>
	</button>
	<button
		on:click={(e) => dispatch("navigate", "checkitout")}
		class={current == "checkitout" ? "current" : ""}
		{disabled}>checkitout</button
	>
	<button
		on:click={(e) => dispatch("navigate", "maybefollow")}
		class={current == "maybefollow" ? "current" : ""}
		{disabled}>maybefollow</button
	>
</nav>

<style>
	button.current {
		font-weight: 700;
	}
	button:not(.current) {
		font-style: italic;
	}
</style>
