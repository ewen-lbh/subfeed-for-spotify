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

export interface AudioFeatures {
	// A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.
	acousticness: number

	// A URL to access the full audio analysis of this track. An access token is required to access this data.
	analysis_url: string

	// Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.
	danceability: number

	// The duration of the track in milliseconds.
	duration_ms: number

	// Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.
	energy: number

	// The Spotify ID for the track.
	id: string

	// Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.
	instrumentalness: number

	// The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on.
	key: number

	// Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.
	liveness: number

	// The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typical range between -60 and 0 db.
	loudness: number

	// Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.
	mode: number

	// Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.
	speechiness: number

	// The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.
	tempo: number

	// An estimated overall time signature of a track. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure).
	time_signature: number

	// A link to the Web API endpoint providing full details of the track.
	track_href: string

	// The object type.
	type: "audio_features"

	// The Spotify URI for the track.
	uri: string

	// A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).
	valence: number
}
