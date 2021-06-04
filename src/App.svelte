<script lang="ts">
	import { spotify, savedTracks } from "./stores";
	import Logo from "./Logo.svelte";
	import Nav from "./Nav.svelte";
	import Checkitout from "./pages/checkitout.svelte";
	import Newstuff from "./pages/newstuff.svelte";
	import Maybefollow from "./pages/maybefollow.svelte";
	import Login from "./pages/login.svelte";

	let current = "";
	let logged = false
	$: logged = spotify === null;
	spotify.subscribe(async client => {
		savedTracks.set(await client?.user.getTracks())
	})
</script>

<Logo />
<Nav {current} on:navigate={(e) => (current = e.detail)} />

{#if !logged}
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
