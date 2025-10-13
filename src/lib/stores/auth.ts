import { writable } from 'svelte/store';
import type { OAuthSession } from '@atproto/oauth-client-browser';

interface AuthState {
	session: OAuthSession | null;
	isLoading: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		session: null,
		isLoading: true
	});

	return {
		subscribe,
		setSession: (session: OAuthSession | null) => {
			update((state) => ({ ...state, session, isLoading: false }));
		},
		setLoading: (isLoading: boolean) => {
			update((state) => ({ ...state, isLoading }));
		},
		logout: () => {
			set({ session: null, isLoading: false });
		}
	};
}

export const authStore = createAuthStore();
