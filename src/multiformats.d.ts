declare module 'multiformats/cid' {
	export class CID {
		static isCID(value: unknown): value is CID;
		static asCID(value: unknown): CID | null;
	}
}
