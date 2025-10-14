// Define your custom ATProto lexicon schema
export const CUSTOM_NSID = 'app.pindrop.pin'; // Replace with your namespace

export interface Pin {
	label: string;
	lat: number;
	lng: number;
	date: string; // ISO 8601 format like "2025-10-13T14:30:00.000Z"
	createdAt: string;
}

// date: new Date('2025-10-13').toISOString() // Specific date
// const dateObj = new Date(pin.date);
