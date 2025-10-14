import { getOAuthClient } from '$lib/atproto/client';
import { Agent } from '@atproto/api';
import type { OAuthSession } from '@atproto/oauth-client-browser';

class AuthStore {
	session = $state<OAuthSession | null>(null);
	agent = $state<Agent | null>(null);
	handle = $state<string | null>(null);
	isLoading = $state(true);
	error = $state<string | null>(null);

	get did() {
		return this.session?.sub ?? null;
	}

	get isAuthenticated() {
		return this.session !== null;
	}

	async init() {
		const client = getOAuthClient();
		if (!client) {
			this.error = 'OAuth client not available';
			this.isLoading = false;
			return;
		}

		try {
			const result = await client.init();
			this.session = result?.session ?? null;

			if (this.session) {
				this.agent = new Agent(this.session);
				await this.fetchHandle();
			}
		} catch (err) {
			console.error('Failed to initialize session:', err);
			this.error = 'Failed to initialize authentication';
		} finally {
			this.isLoading = false;
		}
	}

	async fetchHandle() {
		if (!this.agent || !this.did) return;

		try {
			const response = await this.agent.com.atproto.repo.describeRepo({
				repo: this.did
			});
			this.handle = response.data.handle;
		} catch (err) {
			console.error('Failed to fetch handle:', err);
			this.error = 'Failed to load user information';
		}
	}

	async logout() {
		const client = getOAuthClient();
		if (!client || !this.session?.sub) return;

		try {
			await client.revoke(this.session.sub);
			this.clearSession();
		} catch (err) {
			console.error('Failed to logout:', err);
			this.error = 'Failed to logout';
		}
	}

	clearSession() {
		this.session = null;
		this.agent = null;
		this.handle = null;
		this.error = null;
	}
}

export const authStore = new AuthStore();
