# Frontend architecture

The website uses the Next.js Pages Router. Files inside `src/pages` are URLs; reusable code must not be placed there.

## Where to make changes

- `src/pages` — route entry points and server-side data loading only.
- `src/components/home` — homepage sections and hero-phone experience.
- `src/components/episodes` — public episode UI, transcript, and topic form.
- `src/components/podcasts` — public podcast-series UI.
- `src/components/contact` — contact-page sections.
- `src/components/layout` — public/admin shells, navigation, and footer.
- `src/components/media` — audio, Spotify, video, and YouTube players.
- `src/components/seo` — document metadata.
- `src/components/ui` — generic reusable UI primitives.
- `src/components/admin` — dashboard-only components, grouped by feature.
- `src/services` — browser/API communication. `apiClient.js` configures Axios; `podcastApi.js` exposes application requests.
- `src/context` — application-wide React providers.
- `src/data` — static content and development-only preview fixtures.
- `src/styles` — global, theme, legacy, and CSS-module styles.
- `src/utils` — framework-independent helpers.

## Episode cards

- Public cards: `src/components/episodes/PublicEpisodeCard.jsx`
- Dashboard cards: `src/components/admin/episodes/AdminEpisodeCard.jsx`

They are deliberately separate because the public card controls SEO/navigation presentation, while the dashboard card controls playback, edit, disable, and delete actions.

## Route examples

- Homepage: `src/pages/index.js` → `src/components/home/HomePage.jsx`
- Episode archive: `src/pages/episode/index.jsx`
- Episode detail: `src/pages/episode/[slug].jsx`
- Dashboard episode editor: `src/pages/admin/episode/edit.jsx`

