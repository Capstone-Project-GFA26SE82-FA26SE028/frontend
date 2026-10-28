# Kitchen KDS

Kitchen contains one page at /kitchen: a full-width, four-column display. Old Kitchen paths redirect here. Other Kitchen pages, embedded tool panels, sidebar components and demo Redux data/rules have been removed.

## Features

- Pending (amber), Cooking (blue), Ready (green), Hold (purple).
- Orders with mixed dish statuses appear in the matching lanes without hiding held dishes.
- Search, priority and long-wait filters, arrival/priority sorting, focus mode and dish details.
- Station selection, Refresh and shared authentication/sign-out.
- Cooking and Ready updates use the task row version and reload committed server data. Hold is displayed from API data; no unsupported Hold mutation is sent.

## API

Set VITE_API_URL to the gateway base URL including /api. The display reads /kitchen-stations, /kitchen-tasks (status=all, every page) and /items for dish images/names. Tasks poll every 5 seconds; menu data every 30 seconds. Permission errors stop automatic polling/retries. Clicking a dish photo opens a recipe popup on KDS and fetches only /items/{itemId}/recipes/active, with loading, no-recipe and error states. Kitchen does not call table, inventory or notification APIs. Backend code and permissions are unchanged.

## Validation

- npm run build
- npx eslint src/features/kitchen src/layouts/kitchen src/routes/kitchenRoutes.tsx src/app/store.ts
- node --experimental-strip-types --test scripts/kitchen-api.test.mjs scripts/kitchen-pages.test.mjs

## Structure

All KDS code lives in src/features/kitchen/kds, following the Admin feature layout:

- api/kdsApi.ts: HTTP requests, response envelopes, pagination and query error/retry policy.
- hooks/useKdsData.ts: station/task/menu queries and state transitions.
- hooks/useKdsBoard.ts: filters, sorting, selection, focus mode and board actions.
- hooks/useRecipe.ts: fetch the clicked dish recipe.
- hooks/useKds.ts and context/KdsContext.ts: access to shared KDS state.
- components/: header, overview, filters, board, columns, order cards, dish lines, detail/recipe modals, feedback and provider.
- pages/KdsPage.tsx: compose the screen.
- utils/: API-to-view mapping, order grouping, time and search helpers.
- types.ts and constants.ts: feature models, status definitions and Tailwind color variants. Styling uses Tailwind utility classes directly in components; KDS has no separate CSS files.

The old kitchen/api and kitchen/shared directories are no longer used. Types and API helpers for removed inventory/menu-management workflows have been removed.
