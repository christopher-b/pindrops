// Define your custom ATProto lexicon schema
export const CUSTOM_NSID = 'app.myapp.post'; // Replace with your namespace

export interface CustomPost {
	text: string;
	createdAt: string;
	tags?: string[];
}
