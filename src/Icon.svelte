<script lang="ts">
	export let name: string
	export let outlined: boolean = false
</script>

<span class="icon">
	{#if name === "play"}
		<!-- ‣ -->
		&#xe037;
	{:else if name === "heart"}
		{#if outlined}
			<!-- ♡ -->
			&#xe87e;
		{:else}
			<!-- ♥ -->
			&#xe87d;
		{/if}
	{/if}
</span>

<style>
	span {
		font-family: "Material Icons Outlined";
		color: inherit;
		font-size: 0.9em;
	}
</style>
