<script lang="ts">
	import { Client } from "spotify-api.js";

	import Heading from "../Heading.svelte";
	import { spotify } from "../stores";

	let credentials = {
		id: "",
		secret: "",
	};

	let login = async (e) => {
		let client = new Client("grhgiurehregiuh");
		console.log("created client")
		await client.login(credentials.id, credentials.secret);
		spotify.set(client);
	};
</script>

<Heading>Please create a Spotify app and enter your credentials</Heading>
<form on:submit|preventDefault={login}>
	<label for="client_id">Client ID</label>
	<input id="client_id" type="text" bind:value={credentials.id} />
	<label for="client_secret">Client Secret</label>
	<input id="client_secret" type="password" />

	<button>Log in</button>
</form>
