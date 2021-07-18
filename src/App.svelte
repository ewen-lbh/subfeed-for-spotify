<script lang="ts">
	import { tokens } from "./stores"
	import Logo from "./Logo.svelte"
	import Nav from "./Nav.svelte"
	import Newstuff from "./pages/newstuff.svelte"
	import Maybefollow from "./pages/maybefollow.svelte"
	import Login from "./pages/login.svelte"

	let current = "newstuff"
</script>

<Logo />
<Nav {current} on:navigate={e => (current = e.detail)} />

<main>
	{#if $tokens.access === ""}
		<Login />
	{:else if current == "newstuff"}
		<Newstuff />
		<!-- {:else if current == "checkitout"}
	<Checkitout /> -->
	{:else if current == "maybefollow"}
		<Maybefollow />
	{:else}
		<h1>404</h1>
	{/if}
</main>

<footer>
	Data from <br />
	<img
		src="https://developer.spotify.com/assets/branding-guidelines/logo.png"
		alt="Spotify"
		width="200"
	/>
</footer>

<style>
	footer {
		margin: 0 auto;
		text-align: center;
		grid-area: footer;
	}

	main {
		max-width: 1000px;
		margin: 0 auto;
		grid-area: main;
	}

	@media (min-width: 1500px) {
		:global(body) {
			display: grid;
			grid-template-areas:
				"logo main"
				"nav main"
				"footer main";
			grid-auto-columns: 300px 1fr;
			grid-template-rows: 1fr 3fr 1fr;
			align-items: start;
		}

		:global(nav),
		:global(.logo),
		footer {
			position: fixed;
		}

		footer {
			left: 4em;
			bottom: 4em;
		}
		:global(.logo) {
			left: 4em;
			top: 0.5em;
		}
		:global(nav) {
			left: 4em;
			top: 200px;
		}
	}
</style>
