import { NSID, type Pin } from '$lib/atproto/schema';

const PUBLIC_API = 'https://public.api.bsky.app';
const ATPROTO_API = 'https://bsky.social';

/**
 * Resolve an ATProto handle to a DID using the public API.
 * No authentication required.
 */
export async function resolveHandle(handle: string): Promise<string> {
	const url = `${PUBLIC_API}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`;
	const res = await fetch(url);

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Failed to resolve handle "${handle}": ${res.status} ${body}`);
	}

	const data = await res.json();
	return data.did;
}

/**
 * Fetch pins for a user (by DID) using the public API.
 * No authentication required — ATProto repos are publicly readable.
 */
export async function fetchPublicPins(did: string): Promise<Pin[]> {
	const url = `${ATPROTO_API}/xrpc/com.atproto.repo.listRecords?repo=${encodeURIComponent(did)}&collection=${encodeURIComponent(NSID)}&limit=100`;
	const res = await fetch(url);

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Failed to fetch pins for ${did}: ${res.status} ${body}`);
	}

	const data = await res.json();

	return data.records.map((record: any) => ({
		id: record.uri || record.cid,
		lat: Number(record.value.lat),
		lng: Number(record.value.lng),
		label: record.value.label,
		date: record.value.date ?? ''
	}));
}
