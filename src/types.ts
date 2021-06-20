export interface Paginated<T> {
	href: string
	items: T[]
	limit: number
	next: string | null
	offset: number
	previous: string | null
	total: number
}

export interface CursorPaginated<T> {
	cursors: { after: string }[]
	href: string
	items: T[]
	limit: number
	next: string | null
	total: number
}

export interface Image {
	width: number | null
	url: string
	height: number | null
}

export interface SimplifiedArtist {
	name: string
	type: "artist"
	uri: string
	href: string
	id: string
	external_urls: {
		spotify: string
	}
}

export interface SimplifiedAlbum {
	album_type: "album" | "single" | "compilation"
	available_markets: string[]
	artists: SimplifiedArtist[]
	href: string
	id: string
	images: {
		height?: number | null
		url: string
		width?: number | null
	}[]
	name: string
	release_date: string
	release_date_precision: "year" | "month" | "day"
	total_tracks: number
	type: "album"
	uri: string
	external_urls: {
		spotify: string
	}
}

export interface SimplifiedTrack {
	artists: SimplifiedArtist[]
	available_markets: string[]
	disc_number: number
	duration_ms: number
	explicit: boolean
	href: string
	id: string
	is_local: boolean
	is_playable: boolean
	name: string
	preview_url: string
	track_number: number
	type: "track"
	uri: string
	external_urls: {
		spotify: string
	}
	is_saved?: boolean
}

export interface Track extends SimplifiedTrack {
	album: SimplifiedAlbum
	artists: Artist[]
	popularity: number
}

export interface SavedTrack {
	added_at: string
	track: Track
}

export interface Album extends SimplifiedAlbum {
	label: string
	tracks: Paginated<SimplifiedTrack>
}

export interface Artist extends SimplifiedArtist {
	genres: string[]
	images: Image[]
	popularity: number
}

export type ArtistWithSavedTracks = Artist & { savedTracks: SavedTrack[] }
