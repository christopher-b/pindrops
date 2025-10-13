export type DidService = {
	id: string;
	type: string;
	serviceEndpoint: string;
};

export type DidDocument = {
	id: string;
	service?: DidService[];
	// Add other DID doc fields as needed
};
