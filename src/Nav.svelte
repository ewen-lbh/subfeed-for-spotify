<script lang="ts">
	import Icon from "./Icon.svelte"
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()
	import { spotify } from "./stores"

	export let current: string
	let disabled: boolean
	spotify.subscribe((client) => (disabled = client === null))

	const logout = (_: any) => {
		window.localStorage.clear()
		window.location.reload()
	}
</script>

<nav>
	<button
		on:click={(_) => dispatch("navigate", "newstuff")}
		class:current={current === "newstuff"}
		{disabled}
	>
		newstuff <button class="play-button" on:click={(_) => dispatch("play-all-newstuff")}
			><Icon name="play" outlined /></button
		>
	</button>
	<!-- <button
		on:click={(e) => dispatch("navigate", "checkitout")}
		class:current={current == "checkitout"}
		{disabled}>checkitout</button
	> -->
	<button
		on:click={(e) => dispatch("navigate", "maybefollow")}
		class:current={current == "maybefollow"}
		{disabled}>maybefollow</button
	>
	<button id="logout" on:click={logout}>logout</button>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-around;
		align-items: center;
		max-width: 1000px;
		margin: 0 auto;
	}
	button {
		background: transparent;
		border: none;
		font-family: IBM Plex Mono, monospace;
		font-size: 1.25em;
		display: flex;
		align-items: center;
	}
	button:hover {
		cursor: pointer;
		font-style: normal;
	}
	.play-button {
		background-color: var(--primary);
		height: 1.5em;
		width: 1.5em;
		margin-left: 0.5em;
		display: flex;
		align-items: center;
		margin-bottom: 0;
	}
	button.current {
		font-weight: 700;
	}
	button:not(.current) {
		font-style: italic;
	}
	button:not(.current).play-button {
		font-style: normal;
	}
</style>
