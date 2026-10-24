# Inventory Monitoring — Manager

English UI for UC_MGR_07 and the available transaction evidence for UC_MGR_08.

```text
inventory-monitoring/
  components/  Filters, refresh time, movement and lot tables, navigation
  hooks/       Stock, movement, and lot queries
  pages/       StockOverviewPage, StockHistoryPage, StockVariancePage
  schemas/     Zod schemas for Inventory responses
  types/       Movement and StockLot types
  utils/       Stock status, business-date filtering, transaction totals
```

## Supported behavior

- `/manager/stock`: search name/code, filter stock status and activity, display
  ingredient counts, base-unit stock and alert thresholds, open ingredient details.
- `/manager/stock-history?ingredientId=...`: movement history and receipt lots,
  expiry status and server-provided issue eligibility, movement date/type filters,
  incoming/outgoing/net totals for one ingredient, export filtered movements to CSV.
- `/manager/stock-variance?ingredientId=...`: review negative movements and recorded
  outflow in a period, with missing usage/variance inputs clearly indicated.

Reads use existing Inventory API endpoints, with Identity enforcing manager read
access. No stock adjustment or inventory write endpoints are used.
Polling runs every 30 seconds, paused when the browser is in the background.
The displayed refresh timestamp is the successful fetch time, not the last stock
transaction time. There is no push/realtime transport or warehouse filter because
the current endpoints do not provide those capabilities.

The API exposes pagination but no date/type or out-of-stock filter. Queries read
all pages before filtering and paginating locally, so totals and date filters do
not silently operate on one page. Abort signals cancel obsolete requests. This is
suitable for the existing API; large histories should later use server-side
date/type filtering and aggregation. Date ranges include whole days in UTC+7;
lot lists are not limited by movement date filters. Quantities of different
ingredients/units are never added together.

## UC_MGR_08 limitation

The backend has no report combining prepared item quantities, historical BOM,
stocktakes, and distinct disposal records. The UI does not label all stock issues
as consumption or wastage, infer a cause, calculate a variance from missing data,
or modify stock. Expected usage, actual usage, and variance remain unavailable.
Completing UC_MGR_08 requires a backend reconciliation/reporting contract.

Validation: `npm run build`, `npm run lint`; pure utility checks cover stock status,
UTC+7 date boundaries, movement-type filtering, and incoming/outgoing/net totals.
