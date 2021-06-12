<script lang="ts">
	import { spotify, tokens } from "./stores";
	import Logo from "./Logo.svelte";
	import Nav from "./Nav.svelte";
	import Checkitout from "./pages/checkitout.svelte";
	import Newstuff from "./pages/newstuff.svelte";
	import Maybefollow from "./pages/maybefollow.svelte";
	import Login from "./pages/login.svelte";

	let current = "newstuff";
	console.log($spotify.get("me"));
</script>

<Logo />
<Nav {current} on:navigate={(e) => (current = e.detail)} />

{#if $tokens.access === ""}
	<Login />
{:else if current == "newstuff"}
	<Newstuff />
{:else if current == "checkitout"}
	<Checkitout />
{:else if current == "maybefollow"}
	<Maybefollow />
{:else}
	<h1>404</h1>
{/if}

<footer>
	Data from <br>
	<img src="https://developer.spotify.com/assets/branding-guidelines/logo.png" alt="Spotify" width="200">
</footer>

<style>
	footer {
		margin: 0 auto;
		height: 100vh;
		text-align: center;
	}
</style>
