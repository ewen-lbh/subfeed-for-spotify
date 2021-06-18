import axios from "axios"

/*
 * Functions to authenticate with Spotify
 * Using PKCE
 * As I can't store client secrets inside the source code
 */
function sha256(plain: string) {
	// returns promise ArrayBuffer
	const encoder = new TextEncoder()
	const data = encoder.encode(plain)
	return window.crypto.subtle.digest("SHA-256", data)
}

function base64urlencode(a: ArrayBuffer) {
	// Convert the ArrayBuffer to string using Uint8 array.
	// btoa takes chars from 0-255 and base64 encodes.
	// Then convert the base64 encoded to base64url encoded.
	// (replace + with -, replace / with _, trim trailing =)
	return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "")
}

export function generateCodeVerifier(): string {
	let buf = new Uint8Array(64)
	window.crypto.getRandomValues(buf)
	return String(buf).replace(/,/g, "_").substring(0, 64)
}

export async function codeChallengeFromVerifier(
	verifier: string
): Promise<string> {
	let hashed = await sha256(verifier)
	return base64urlencode(hashed)
}

const CLIENT_ID = "473502f1844341978712580b1db507c2"
const REDIRECT_URI =
	window.location.protocol +
	"//" +
	window.location.host +
	window.location.pathname

export type Tokens = {
	access: string
	refresh: string
	expiresIn: number
	grantedScopes: string[]
	verifier?: string
}

export async function makeAuthorizationRequestURL(
	codeVerifier: string,
	scopes: string[]
): Promise<string> {
	return (
		"https://accounts.spotify.com/authorize" +
		"?client_id=" +
		encodeURIComponent(CLIENT_ID) +
		"&response_type=code" +
		"&redirect_uri=" +
		encodeURIComponent(REDIRECT_URI) +
		"&code_challenge_method=S256" +
		"&code_challenge=" +
		encodeURIComponent(await codeChallengeFromVerifier(codeVerifier)) +
		/*TODO + "&state=" + */
		"&scope=" +
		encodeURIComponent(scopes.join(" "))
	)
}

export async function getTokens(
	authorizationCode: string,
	codeVerifier: string
): Promise<Tokens> {
	const data = new URLSearchParams()
	data.append("client_id", CLIENT_ID)
	data.append("grant_type", "authorization_code")
	data.append("code", authorizationCode)
	data.append("redirect_uri", REDIRECT_URI)
	data.append("code_verifier", codeVerifier)

	const response = await axios.post(
		"https://accounts.spotify.com/api/token",
		data,
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}
	)
	if (response.status == 400) {
		console.error("Failed to authenticate: ", JSON.stringify(response.status))
	}
	return {
		access: response.data.access_token,
		refresh: response.data.refresh_token,
		expiresIn: response.data.expires_in,
		grantedScopes: response.data.scope.split(" "),
	}
}

export function readTokensFromLocalStorage(): Tokens {
	let initialTokens: Tokens = {
		access: "",
		refresh: "",
		expiresIn: 0,
		grantedScopes: [],
	}
	let localTokensString = window.localStorage.getItem("tokens")
	if (localTokensString !== null) {
		try {
			const parsedTokens = JSON.parse(localTokensString)
			return parsedTokens
			// if (Object.getOwnPropertyNames(parsedTokens) === ['access', 'refresh', 'expiresIn', 'grantedScopes']) {
			// 	// TODO typecheck each property?
			// 	console.info(`Successfully read from localStorage into ${parsedTokens}`)
			// 	return parsedTokens
			// } else {
			// 	console.warn(`Couldn't load from localStorage: object had extra or missing properties (${Object.getOwnPropertyNames(parsedTokens)} instead of access,refresh,expiresIn,grantedScopes)`)
			// }
		} catch {
			console.warn(
				`Couldn't load from localStorage: value was not correct JSON`
			)
			return initialTokens
		}
	}
	return initialTokens
}

export async function refreshToken(tokens: Tokens): Promise<Tokens> {
	return await axios.post("https://accounts.spotify.com/api/token", {
		grant_type: "refresh_token",
		refresh_token: tokens.refresh,
		client_id: CLIENT_ID,
	})
}
