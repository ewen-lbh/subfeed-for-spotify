<script lang="ts">
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	export let action: string = ""
</script>

<h1>
	<slot></slot>
	{#if action}
		<button on:click={e => dispatch('action')}>{@html action}</button>
	{/if}
</h1>
