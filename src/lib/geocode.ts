const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

interface NominatimAddress {
	city?: string;
	town?: string;
	village?: string;
	hamlet?: string;
	municipality?: string;
	state?: string;
	country?: string;
	country_code?: string;
}

interface NominatimResponse {
	address: NominatimAddress;
	display_name: string;
}

/**
 * Reverse-geocode a lat/lng pair into a short place name using the
 * OpenStreetMap Nominatim API (free, no key required, 1 req/s limit).
 *
 * Returns a string like "Portland, Oregon" or "Tokyo, Japan".
 * Returns an empty string on error or if no result is found.
 */
export async function reverseGeocode(
	lat: number,
	lng: number,
	signal?: AbortSignal
): Promise<string> {
	const params = new URLSearchParams({
		lat: lat.toString(),
		lon: lng.toString(),
		format: 'json',
		zoom: '10', // city-level detail
		addressdetails: '1'
	});

	const res = await fetch(`${NOMINATIM_URL}?${params}`, {
		headers: {
			// Nominatim requires a meaningful User-Agent for their usage policy
			'User-Agent': 'PinDrops/1.0 (https://pindrops.app)'
		},
		signal
	});

	if (!res.ok) return '';

	const data: NominatimResponse = await res.json();
	if (!data.address) return '';

	const city =
		data.address.city ??
		data.address.town ??
		data.address.village ??
		data.address.hamlet ??
		data.address.municipality ??
		'';

	const region = data.address.state ?? '';
	const country = data.address.country ?? '';

	// Build a short label: "City, State" for US/CA/AU, "City, Country" otherwise
	const useLongRegion = ['us', 'ca', 'au'].includes(
		data.address.country_code?.toLowerCase() ?? ''
	);

	if (city && (useLongRegion ? region : country)) {
		return `${city}, ${useLongRegion ? region : country}`;
	}

	if (city) return city;
	if (region) return `${region}, ${country}`;
	if (country) return country;

	return '';
}
