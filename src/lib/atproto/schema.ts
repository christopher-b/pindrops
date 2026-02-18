// Define your custom ATProto lexicon schema
export const NSID = 'app.pindrops.pin'; // Replace with your namespace

export interface Pin {
	id: string;
	label: string;
	lat: number;
	lng: number;
	date: string; // ISO 8601 format like "2025-10-13T14:30:00.000Z"
}

/**
 * Convert a raw ATProto record into an app-level Pin.
 * Shared by both the authenticated pin store and the public API fetcher.
 */
export function recordToPin(record: { uri: string; cid: string; value: Record<string, unknown> }): Pin {
	return {
		id: record.uri || record.cid,
		lat: Number(record.value.lat),
		lng: Number(record.value.lng),
		label: record.value.label as string,
		date: (record.value.date as string) ?? ''
	};
}
