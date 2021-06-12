<script lang="ts">
	import { onMount } from "svelte";

	import Heading from "../Heading.svelte";
	import {
		generateCodeVerifier,
		getTokens,
		makeAuthorizationRequestURL,
	} from "../pkce";
	import { spotify, tokens } from "../stores";

	onMount(async () => {
		// localStorage is needed to keep the same code_verifier accross reloads
		// Else generateCodeVerifier() just generates a different one, and thus
		// there's a mismatch between the one used to makeAuthorizationRequestURL and respondToCallback.
		const codeVerifier =
			window.localStorage.getItem("code_verifier") || generateCodeVerifier();
		window.localStorage.setItem("code_verifier", codeVerifier);
		const urlParams = new URLSearchParams(window.location.search);
		const authCode = urlParams.get("code") || "";

		if (authCode !== "") {
			$tokens = await getTokens(authCode, codeVerifier);
			window.localStorage.setItem("tokens", JSON.stringify($tokens));
			window.location.search = ""; // Remove ugly unneeded query string (causes a reload)
		} else {
			const url = await makeAuthorizationRequestURL(codeVerifier, [
				"user-library-read",
				"user-follow-read",
				"user-modify-playback-state",
			]);
			console.log(`requesting auth thru ${url}`);
			window.location.href = url;
		}
	});
</script>

<Heading>Logging you in...</Heading>
