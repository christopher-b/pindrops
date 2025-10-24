import { Browser, LatLng } from 'leaflet';

export const mapOptions = {
	// tilesUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}',
	// tilesUrl: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}{r}.{ext}',
	// tilesUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.{ext}',
	// tilesUrl: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}',
	// tilesUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
	tilesUrl:
		'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}' +
		(Browser.retina ? '@2x.png' : '.png'),
	subdomains: 'abcd',
	mapOptions: {
		center: new LatLng(25, -40),
		zoom: 3,
		minZoom: 2
	},
	tileOptions: {
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> / &copy; <a href="https://carto.com/attributions">CARTO</a>',
		ext: 'jpg'
	}
};

// "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}",
// "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.{ext}",
// "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}"
