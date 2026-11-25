# Manager kitchen monitoring

`/manager/kitchen-monitoring` is a read-only page with independent API,
components, hooks, schemas, types, and utilities. It does not import Admin,
Kitchen KDS, or another Manager feature.

Reads:
- `/kitchen-tasks?status=all`: all pages, including ready and cancelled tasks.
- `/kitchen-tasks/summary`: server-side kitchen totals and average cooking time.
- `/tables?restaurantId=...`: all pages of table names in the assigned restaurant.

Tasks and summary use the backend's authorized restaurant scope. Query caches
and detail selections are isolated by user and assigned restaurant. Reads
refresh every 15 seconds while visible and on focus; authentication or access
failures stop automatic polling. The refresh button reloads all three reads.

Search supports order number, item and table. Filters support status, station,
queue date (UTC+7), a table deep link, and pending tasks waiting over 15 minutes.
Summary cards describe the whole restaurant; filters apply to the task list.
Late ETA and pending-over-15-minute warnings have separate meanings.
Takeaway tasks need no table; a failure to load table names does not hide tasks.

Details show the latest loaded task, options, note, status, and timeline.
There are no status, priority, cancellation, or other mutation requests.

Validation: build, lint, mocked API pagination/schema/error checks, and
time-filter/waiting/late-warning checks. Live UI verification requires running
backend services and a signed-in Manager session.
