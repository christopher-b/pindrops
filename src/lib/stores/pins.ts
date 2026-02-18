import { writable, get } from 'svelte/store';
import { agent } from '$lib/stores/auth';
import { NSID, type Pin } from '$lib/atproto/schema';

// export type Pin = {
// 	id: string | null;
// 	lat: number;
// 	lng: number;
// 	label: string;
// 	// date: string;
// };

function createPinsStore() {
	const pins = writable<Pin[]>([]);
	const loading = writable<boolean>(false);
	const error = writable<string | null>(null);

	/**
	 * Fetch pins for the given user (by DID).
	 * Replaces pins store contents with fetched pins.
	 */
	async function fetchPins(did: string) {
		loading.set(true);
		error.set(null);
		pins.set([]);
		const $agent = get(agent);

		try {
			if (!$agent) throw new Error('Agent not available');

			const res = await $agent.com.atproto.repo.listRecords({
				repo: did,
				collection: NSID,
				limit: 100
			});
			console.log('fetch pins: ', res);

			const loadedPins: Pin[] = res.data.records.map((record: any) => ({
				id: record.uri || record.cid,
				lat: record.value.lat,
				lng: record.value.lng,
				label: record.value.label
			}));

			pins.set(loadedPins);
		} catch (err) {
			console.error('Failed to load pins:', err);
			error.set('Failed to load pins');
			pins.set([]);
		} finally {
			loading.set(false);
		}
	}

	/**
	 * Add a pin for the DID associated with the current agent/session.
	 */
	async function addPin(did: string, pin: Omit<Pin, 'id'>) {
		const $agent = get(agent);
		if (!$agent) throw new Error('Agent not available');

		try {
			const res = await $agent.com.atproto.repo.createRecord({
				repo: did,
				collection: NSID,
				record: { ...pin }
			});
			if (!res.success) throw new Error(JSON.stringify(res.data));

			const newPin: Pin = { id: res.data.uri, ...pin };
			pins.update((arr) => [...arr, newPin]);
		} catch (err) {
			console.error('Failed to add pin:', err);
			error.set('Failed to add pin');
		}
	}

	/**
	 * Remove a pin by ID for the given DID.
	 */
	async function removePin(did: string, id: string) {
		const $agent = get(agent);
		if (!$agent) throw new Error('Agent not available');

		// `id` should be a pin URI. Extract the rkey
		const rkey = id.split('/').pop();
		if (!rkey) throw new Error('Could not determine pin rkey');

		try {
			await $agent.com.atproto.repo.deleteRecord({
				repo: did,
				collection: NSID,
				rkey
			});
			pins.update((arr) => arr.filter((p) => p.id !== id));

			return true;
		} catch (err) {
			console.error('Failed to delete pin:', err);
			error.set('Failed to delete pin');
		}
	}

	/**
	 * Update an existing pin's label.
	 */
	async function updatePin(did: string, id: string, updates: Partial<Omit<Pin, 'id'>>) {
		const $agent = get(agent);
		if (!$agent) throw new Error('Agent not available');

		const rkey = id.split('/').pop();
		if (!rkey) throw new Error('Could not determine pin rkey');

		// Get the current pin data to merge with updates
		const currentPins = get(pins);
		const currentPin = currentPins.find((p) => p.id === id);
		if (!currentPin) throw new Error('Pin not found');

		const updatedRecord = {
			lat: updates.lat ?? currentPin.lat,
			lng: updates.lng ?? currentPin.lng,
			label: updates.label ?? currentPin.label
		};

		try {
			const res = await $agent.com.atproto.repo.putRecord({
				repo: did,
				collection: NSID,
				rkey,
				record: updatedRecord
			});
			if (!res.success) throw new Error(JSON.stringify(res.data));

			pins.update((arr) =>
				arr.map((p) => (p.id === id ? { ...p, ...updates } : p))
			);

			return true;
		} catch (err) {
			console.error('Failed to update pin:', err);
			error.set('Failed to update pin');
		}
	}

	return {
		pins,
		loading,
		error,
		fetchPins,
		addPin,
		removePin,
		updatePin
	};
}

export const pinStore = createPinsStore();
