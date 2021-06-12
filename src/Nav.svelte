<script lang="ts">
	import Icon from "./Icon.svelte";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	import { spotify } from "./stores";

	export let current: string;
	let disabled: boolean;
	spotify.subscribe((client) => (disabled = client === null));

	const logout = (e) => {
		window.localStorage.clear()
		window.location.reload()
	}
</script>

<nav>
	<button
		on:click={(e) => dispatch("navigate", "newstuff")}
		class:current={current === "newstuff"}
		{disabled}
	>
		newstuff <button on:click={(e) => dispatch("play-all-newstuff")}
			><Icon name="play" /></button
		>
	</button>
	<button
		on:click={(e) => dispatch("navigate", "checkitout")}
		class:current={current == "checkitout"}
		{disabled}>checkitout</button
	>
	<button
		on:click={(e) => dispatch("navigate", "maybefollow")}
		class:current={current == "maybefollow"}
		{disabled}>maybefollow</button
	>
	<button id="logout" on:click={logout}>logout</button>
</nav>

<style>
	button.current {
		font-weight: 700;
	}
	button:not(.current) {
		font-style: italic;
	}
</style>
