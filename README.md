# PinDrops

A map-based pin board built with [SvelteKit](https://svelte.dev/docs/kit) and the [AT Protocol](https://atproto.com/). Sign in with your Bluesky account to drop labeled pins on a world map — your pins are stored as ATProto records in your own repository.

**Live at [pindrops.app](https://pindrops.app)**

## Features

- **Bluesky OAuth** — sign in with any AT Protocol / Bluesky handle
- **Drop pins** — click the map to create labeled location pins
- **Edit & delete** — manage your own pins inline
- **View others** — browse any user's public pins at `/view/[handle]`
- **Fully client-side** — static SPA deployed to Cloudflare Pages, no server required

## Tech Stack

- [SvelteKit](https://svelte.dev/docs/kit) (static adapter, SPA mode)
- [Leaflet](https://leafletjs.com/) for maps
- [@atproto/oauth-client-browser](https://www.npmjs.com/package/@atproto/oauth-client-browser) for authentication
- [@atproto/api](https://www.npmjs.com/package/@atproto/api) for reading/writing ATProto records
- [bits-ui](https://www.bits-ui.com/) for UI primitives
- [Inter](https://rsms.me/inter/) typeface
- Icons from [Phosphor Icons](https://phosphoricons.com)

## ATProto Schema

Pins are stored under the `app.pindrops.pin` NSID in each user's ATProto repository with the following shape:

```json
{
  "lat": 45.5231,
  "lng": -122.6765,
  "label": "Portland",
  "date": "2025-10-13T14:30:00.000Z"
}
```

## Development

```sh
yarn install
yarn dev
```

## Building

```sh
yarn build
yarn preview   # preview the production build locally
```

## Deployment

The app is configured with `@sveltejs/adapter-static` in SPA mode (fallback to `index.html`). It deploys to [Cloudflare Pages](https://pages.cloudflare.com/) with build command `yarn build` and output directory `build`.
