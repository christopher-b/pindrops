import { AtpAgent } from '@atproto/api';
import type { DidService } from '$lib/types';

/**
 * Resolves an ATProto handle (e.g. alice.bsky.social) to its PDS URL.
 * Returns the PDS URL as a string.
 */
export async function resolvePds(handle: string): Promise<string> {
	console.log(handle);
	const agent = new AtpAgent({ service: 'https://bsky.social' }); // The service here is just for discovery

	// 1. Resolve handle to DID
	const handleResult = await agent.com.atproto.identity.resolveHandle({ handle });
	const did = handleResult.data.did;

	// 2. Fetch the DID document (for did:plc this is from the PLC directory)
	// @TODO Resolve non-plc DIDs
	const didUrl = `https://plc.directory/${did}`;
	const didDocResult = await fetch(didUrl);
	if (!didDocResult.ok) throw new Error('Failed to fetch DID document');
	const didDoc = await didDocResult.json();

	// 3. Find the service endpoint with type 'AtprotoPersonalDataServer'
	const pdsService = (didDoc.service as DidService[] | undefined)?.find(
		(svc) => svc.type === 'AtprotoPersonalDataServer'
	);

	if (!pdsService) {
		throw new Error('PDS service not found in DID document');
	}

	// console.log(pdsService);

	return pdsService.serviceEndpoint;
}
