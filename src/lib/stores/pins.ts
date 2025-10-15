import { writable, get } from 'svelte/store';
import { agent } from '$lib/stores/auth';
import { NSID } from '$lib/atproto/schema';

export type Pin = {
	id: string | null;
	lat: number;
	lng: number;
	label: string;
	// date: string;
};

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

			const loadedPins: Pin[] = res.data.records.map((record: any) => ({
				id: record.uri || record.cid,
				lat: record.value.lat,
				lng: record.value.lng,
				label: record.value.label,
				date: record.value.date
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
			// const res = await $agent.com.atproto.repo.createRecord({
			// 	repo: did,
			// 	collection: NSID,
			// 	record: { ...pin }
			// });
			// const newPin: Pin = { id: res.data.uri, ...pin };
			const newPin = { id: '123', ...pin };
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

		try {
			await $agent.com.atproto.repo.deleteRecord({
				repo: did,
				collection: NSID,
				rkey: id
			});
			pins.update((arr) => arr.filter((p) => p.id !== id));
		} catch (err) {
			console.error('Failed to delete pin:', err);
			error.set('Failed to delete pin');
		}
	}

	return {
		pins,
		loading,
		error,
		fetchPins,
		addPin,
		removePin
	};
}

export const pinStore = createPinsStore();
