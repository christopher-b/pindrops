import { writable, derived, get } from 'svelte/store';
import { getOAuthClient } from '$lib/atproto/client';
import { Agent } from '@atproto/api';
import type { OAuthSession } from '@atproto/oauth-client-browser';

export const isLoading = writable(true);

export const error = writable('');

export const handle = writable('');

export const session = writable<OAuthSession | null>(null);

export const isAuthenticated = derived(session, ($session) => {
	return $session !== null;
});

export const did = derived(session, ($session) => {
	return $session?.sub ?? null;
});

export const agent = derived(session, ($session) => {
	return $session ? new Agent($session) : null;
});

export const init = async () => {
	const client = getOAuthClient();

	if (!client) {
		error.set('OAuth client not available');
		isLoading.set(false);
		return;
	}

	try {
		const result = await client.init();
		const newSession = result?.session ?? null;
		session.set(newSession);

		if (newSession) {
			handle.set((await fetchHandle()) ?? '');
		}
	} catch (err) {
		console.error('Failed to initialize session:', err);
		error.set('Failed to initialize authentication');
	} finally {
		isLoading.set(false);
	}
};

export const logout = async () => {
	const client = getOAuthClient();
	const $session = get(session);
	if (!client || !$session || !$session?.sub) return;

	try {
		await client.revoke($session.sub);
		session.set(null);
		handle.set('');
		error.set('');
	} catch (err) {
		console.error('Failed to logout:', err);
		error.set('Failed to logout');
	}
};

async function fetchHandle() {
	const $agent = get(agent);
	const $did = get(did);

	if (!$agent || !$did) return;

	try {
		const response = await $agent.com.atproto.repo.describeRepo({
			repo: $did
		});

		return response.data.handle;
	} catch (err) {
		console.error('Failed to fetch handle:', err);
		error.set('Failed to load user information');
	}
}
