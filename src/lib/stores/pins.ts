import { writable, get } from 'svelte/store';
import { agent } from '$lib/stores/auth';
import { NSID, type Pin } from '$lib/atproto/schema';

function createPinsStore() {
	const pins = writable<Pin[]>([]);
	const loading = writable<boolean>(false);
	const error = writable<string | null>(null);

	/**
	 * Build a wire-format record from app-level pin data.
	 * The lexicon defines lat/lng as strings and requires a date field.
	 */
	function toRecord(pin: { lat: number; lng: number; label: string; date?: string }) {
		return {
			$type: NSID,
			lat: String(pin.lat),
			lng: String(pin.lng),
			label: pin.label,
			date: pin.date ?? new Date().toISOString()
		};
	}

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
				lat: Number(record.value.lat),
				lng: Number(record.value.lng),
				label: record.value.label,
				date: record.value.date ?? ''
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
				record: toRecord(pin)
			});
			if (!res.success) throw new Error(JSON.stringify(res.data));

			const newPin: Pin = {
				id: res.data.uri,
				...pin,
				date: pin.date ?? new Date().toISOString()
			};
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

		const merged = {
			lat: updates.lat ?? currentPin.lat,
			lng: updates.lng ?? currentPin.lng,
			label: updates.label ?? currentPin.label,
			date: updates.date ?? currentPin.date
		};

		try {
			const res = await $agent.com.atproto.repo.putRecord({
				repo: did,
				collection: NSID,
				rkey,
				record: toRecord(merged)
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
