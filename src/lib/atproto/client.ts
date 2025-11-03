import { BrowserOAuthClient } from '@atproto/oauth-client-browser';
import { browser } from '$app/environment';

let clientInstance: BrowserOAuthClient | null = null;

export async function getOAuthClient() {
	if (!browser) return null;
	if (!clientId) return null;

	if (!clientInstance) {
		clientInstance = await BrowserOAuthClient.load({
			clientId,
			handleResolver: 'https://bsky.social'
		});
	}

	return clientInstance;
}

function buildClientID() {
	if (!browser) return null;

	const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
	if (isLocal) {
		// see https://atproto.com/specs/oauth#localhost-client-development
		return `http://localhost?${new URLSearchParams({
			// @TODO extract to schema config
			scope: 'atproto repo:app.pindrops.pin?action=create&action=delete&action=update',
			redirect_uri: Object.assign(new URL(window.location.origin), { hostname: '127.0.0.1' }).href
		})}`;
	}

	return `https://${window.location.host}/oauth-client-metadata.json`;
}
const clientId = buildClientID();
