# Operations Monitoring — UI preview

This feature is frontend-only. No backend source, permissions, database, or API
contracts are changed. Every page has a visible **Preview · Sample data** banner.

Routes:
- `/manager/table-monitoring`: area/table cards, restaurant and status filters,
  cleaning status, open-session details, and links to kitchen tasks.
- `/manager/kitchen-monitoring`: task-level statuses, station/table/date filters,
  waiting-time display, >15-minute waiting alerts, and task details.
- `/manager/staff-activity`: sample table opening/merging, item cancellation, and
  manual discount records, employee/table/order search, date/type filters,
  pagination, reasons, and before/after details.

Folders: `data`, `hooks`, `components`, `pages`, `schemas`, `types`, `utils`.
Fixtures live in `data/previewOperations.ts`. Query keys use
`manager-operations-preview` so preview data cannot be confused with API caches.
Refresh regenerates the sample records; no monitoring request is sent to backend.

The existing `/api/tables/service` endpoint requires Waiter access; KDS monitoring
and operational-audit endpoints for Manager have not been provided. These preview
pages do not bypass those restrictions. Future integration must replace the hooks
with authorized API reads. The other Manager features keep their existing API
connections.

Validation: `npm run build`, `npm run lint`.
