<script lang="ts">
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	export let action: string = ""
</script>

<h1>
	<slot />
	{#if action}
		<button on:click={e => dispatch("action")}>{@html action}</button>
	{/if}
</h1>

<style>
	h1 {
		font-family: Rubik Mono One, sans-serif;
		font-weight: normal;
	}

	button {
		font-family: DM Serif Display, serif;
		color: var(--primary);
		background: transparent;
		border: none;
	}
</style>
