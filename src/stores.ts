import type { Client, Paging, Saved, Track } from "spotify-api.js";
import { Writable, writable } from "svelte/store";

export const spotify: Writable<Client | null> = writable(null)

export const savedTracks: Writable<Paging<Saved<"track", Track>>> = writable({
	limit: 0,
	offset: 0,
	total: 0,
	items: []
})
