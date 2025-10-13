import { BrowserOAuthClient } from '@atproto/oauth-client-browser';
import { OAuthSession } from '@atproto/oauth-client';
// import { writable } from 'svelte/store';
// import { writable, type Writable } from 'svelte/store';

// Store for the session result
// const sessionResult = writable<undefined | { session: OAuthSession; state?: string | null }>(
// 	undefined
// );

// let sessionState: undefined | OAuthSession = $state(undefined);
let sessionState = $state(undefined);

const client = new BrowserOAuthClient({
	handleResolver: 'https://bsky.social',
	clientMetadata: undefined
});

// Listen for session deletion/logouts
client.addEventListener('deleted', (event: CustomEvent<{ sub: string; cause: unknown }>) => {
	const { sub, cause } = event.detail;
	console.error(`Session for ${sub} is no longer available (cause: ${cause})`);
	sessionState = undefined; // Clear the session in the Svelte store
});

// async function logout() {
// 	// await client.signOut();
// 	// sessionResult.set(undefined);
// }

// Initialize session (should be called on app start)
async function init() {
	sessionState = await client.init();
	// const result = await client.init();
	// sessionState = result;
}

// // Returns a derived store for login state
// function isLoggedIn() {
// 	let loggedIn = false;
// 	sessionResult.subscribe((result) => {
// 		loggedIn = !!result;
// 	})();
// 	return loggedIn;
// }

// // Returns a derived store for the authenticated DID
// function authenticatedDid() {
// 	let did: string | undefined = undefined;
// 	sessionResult.subscribe((result) => {
// 		did = result ? result.session.sub : undefined;
// 	})();
// 	return did;
// }

// Export the client and stores
// export const auth = $state({
export const auth = {
	client,
	init,
	// logout,
	sessionState
	// sessionResult,
	// If you want direct access to values:
	// authenticatedDid,
	// isLoggedIn
};
