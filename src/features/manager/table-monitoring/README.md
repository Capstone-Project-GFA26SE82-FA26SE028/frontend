# Manager tables

The `/manager/table-monitoring` route reads `/tables` and `/areas` for the
current user's assigned restaurant. It renders independent Manager components
matching the Admin area groups, table cards, filters, and detail presentation.

Only GET requests are implemented. There are no create, edit, move, delete,
status-changing, or QR-generating actions. The activity badge describes the
configured active state, not whether guests currently occupy the table.

All API pages are loaded and validated. Queries are scoped by user, restaurant,
and filters, and refresh every 15 seconds while visible and on window focus.
The refresh button also reloads both tables and areas. Server-side restaurant
authorization remains unchanged.

Validation: `npm run build`, `npm run lint`. Live authenticated browser
verification requires a Manager session and running backend services.
