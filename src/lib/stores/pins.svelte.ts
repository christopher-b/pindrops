// src/lib/stores/pins.svelte.ts
import { authStore } from '$lib/stores/auth.svelte';
import { CUSTOM_NSID, type Pin } from '$lib/atproto/schema';
import type { Marker } from 'leaflet';

interface PinWithMetadata {
	record: Pin;
	uri: string;
	marker?: Marker;
}

class PinsStore {
	pins = $state<PinWithMetadata[]>([]);
	isLoading = $state(false);
	error = $state<string | null>(null);

	async loadPins() {
		if (!authStore.agent || !authStore.did) {
			this.error = 'Not authenticated';
			return;
		}

		this.isLoading = true;
		this.error = null;

		try {
			const response = await authStore.agent.com.atproto.repo.listRecords({
				repo: authStore.did,
				collection: CUSTOM_NSID,
				limit: 100
			});

			this.pins = response.data.records.map((record) => ({
				record: record.value as Pin,
				uri: record.uri
			}));
		} catch (err) {
			console.error('Failed to load pins:', err);
			this.error = 'Failed to load pins';
		} finally {
			this.isLoading = false;
		}
	}

	async createPin(pin: Pin) {
		if (!authStore.agent || !authStore.did) {
			this.error = 'Not authenticated';
			throw new Error('Not authenticated');
		}

		try {
			const response = await authStore.agent.com.atproto.repo.createRecord({
				repo: authStore.did,
				collection: CUSTOM_NSID,
				record: pin
			});

			const newPin: PinWithMetadata = {
				record: pin,
				uri: response.uri
			};

			this.pins.push(newPin);
			return newPin;
		} catch (err) {
			console.error('Failed to create pin:', err);
			this.error = 'Failed to create pin';
			throw err;
		}
	}

	async deletePin(uri: string) {
		if (!authStore.agent || !authStore.did) {
			this.error = 'Not authenticated';
			throw new Error('Not authenticated');
		}

		try {
			// Extract rkey from uri (format: at://did/collection/rkey)
			const rkey = uri.split('/').pop();
			if (!rkey) throw new Error('Invalid URI');

			await authStore.agent.com.atproto.repo.deleteRecord({
				repo: authStore.did,
				collection: CUSTOM_NSID,
				rkey
			});

			const pinIndex = this.pins.findIndex((p) => p.uri === uri);
			if (pinIndex !== -1) {
				// Remove marker if it exists
				if (this.pins[pinIndex].marker) {
					this.pins[pinIndex].marker?.remove();
				}
				this.pins.splice(pinIndex, 1);
			}
		} catch (err) {
			console.error('Failed to delete pin:', err);
			this.error = 'Failed to delete pin';
			throw err;
		}
	}

	setMarker(uri: string, marker: Marker) {
		const pin = this.pins.find((p) => p.uri === uri);
		if (pin) {
			pin.marker = marker;
		}
	}

	clearError() {
		this.error = null;
	}

	clear() {
		// Remove all markers
		this.pins.forEach((pin) => {
			pin.marker?.remove();
		});
		this.pins = [];
	}
}

export const pinsStore = new PinsStore();
