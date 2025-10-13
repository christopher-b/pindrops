import { BrowserOAuthClient } from '@atproto/oauth-client-browser';
import { browser } from '$app/environment';

let clientInstance: BrowserOAuthClient | null = null;

export function getOAuthClient() {
	if (!browser) return null;

	if (!clientInstance) {
		clientInstance = new BrowserOAuthClient({
			handleResolver: 'https://bsky.social',
			clientMetadata: undefined
		});
	}

	return clientInstance;
}
