# Kitchen assignments

Route: `/manager/kitchen-stations/assignments`.

Independent Manager page module with API, schemas, types, constants, utilities,
hooks and components. Reads every page of stations and assignments, including
unassigned and inactive stations. Only active kitchen employees returned by the
restaurant-scoped staff endpoint are selectable.

Creates use POST; replacements use PUT with the original `expectedUserId`;
removals use DELETE with `expectedUserId` as a query parameter. The original
assignment remains the concurrency precondition while the form is open.
After a conflict, close the form and reopen the refreshed row before retrying.
The server enforces pending/cooking task constraints. An employee may handle
multiple stations; the UI does not add a restriction absent from the backend.

Queries and local form state are scoped by authenticated user and restaurant.
No sample data or optimistic assignment writes are used.

Validation: `node --test scripts/kitchen-assignments.test.mjs`,
`npx eslint src/features/manager/kitchen-assignments`, and `npm run build`.
