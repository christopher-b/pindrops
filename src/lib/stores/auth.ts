import { writable, derived, get, type Readable } from 'svelte/store';
import { getOAuthClient } from '$lib/atproto/client';
import { Agent } from '@atproto/api';
import type { OAuthSession } from '@atproto/oauth-client-browser';

export const isLoading = writable(true);

export const error = writable('');

export const handle = writable('');

export const session = writable<OAuthSession | null>(null);

export const agent = writable<Agent | null>(null);

export const isAuthenticated = derived(session, ($session) => {
	return $session !== null;
});

export const did: Readable<string | null> = derived(session, ($session) => {
	return $session?.sub ?? null;
});

export const init = async () => {
	const client = await getOAuthClient();
	if (!client) throw new Error('OAuth client not available');

	try {
		const result = await client.init();
		if (!result) return;

		const _session = result?.session ?? null;
		if (!_session) throw new Error('Could not initialize session');
		session.set(_session);

		const _agent = new Agent(_session);
		agent.set(_agent);

		const res = await _agent.com.atproto.server.getSession();
		if (!res.success) throw new Error(JSON.stringify(res));

		handle.set(res.data.handle);
	} catch (err) {
		console.error('Failed to initialize session:', err);
		error.set('Failed to initialize authentication');
	} finally {
		isLoading.set(false);
	}
};

export const logout = async () => {
	const client = await getOAuthClient();
	const $did = get(did);
	if (!client || !$did) return;

	try {
		await client.revoke($did);
		window.location.reload();
	} catch (err) {
		console.error('Failed to logout:', err);
		error.set('Failed to logout');
	}
};
