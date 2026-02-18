// Define your custom ATProto lexicon schema
export const NSID = 'app.pindrops.pin'; // Replace with your namespace

export interface Pin {
	id: string;
	label: string;
	lat: number;
	lng: number;
	date: string; // ISO 8601 format like "2025-10-13T14:30:00.000Z"
}
