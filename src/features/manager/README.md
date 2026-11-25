# Manager page modules

Each Manager page has its own folder:

- `dashboard`
- `categories`
- `dishes`
- `prices`
- `ingredients`
- `units`
- `recipes`
- `food-cost`
- `stock-overview`
- `stock-history`
- `stock-variance`
- `table-monitoring`
- `kitchen-monitoring`
- `staff-activity`

Every page module contains `api`, `components`, `hooks`, `pages`, `schemas`,
`types`, and `utils`. Empty directories use `.gitkeep` until needed.
Additional directories such as `constants` may be added when necessary.

Each sidebar destination is an independent page module. Keep its API clients,
components, hooks, schemas, types, and utilities inside that module, including
the dependencies needed to run that page. Do not create `manager/shared` or
import another Manager page module. Application-wide UI primitives, the HTTP
client, and application state remain in their existing global locations.
Do not recreate grouped modules such as `menu-management`,
`ingredient-management`, `inventory-monitoring`, or `operations-monitoring`.

The profile route uses the application-wide profile feature.
The `analytics`, `promotions`, `purchase-requests`, `reports`, and `suppliers`
folders remain placeholders, not implemented pages.

Table monitoring reads the same tables and areas as Admin, scoped to the Manager's
assigned restaurant. It has independent components, read-only API functions,
filters, details, and 15-second polling. Kitchen monitoring and staff activity
still use preview data. Earlier
implementation notes are preserved in `docs`; their old paths are historical.

Validation: run `npm run build` and `npm run lint` from `frontend`.
