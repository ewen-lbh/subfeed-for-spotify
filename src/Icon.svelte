<script lang="ts">
	export let name: string
	export let outlined: boolean = false
</script>

{#if name === "play"}
	‣
{:else if name === "heart"}
	{#if outlined}
	♡
	{:else}
	♥
	{/if}
{/if}
