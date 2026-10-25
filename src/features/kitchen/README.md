# Kitchen workspace

The `/kitchen` route requires an authenticated, active `kitchen` account. It uses
the shared staff login, session restoration, bearer interceptor, token refresh,
and logout. Successful Kitchen sign-in redirects from `/login` to `/kitchen`.
Other roles retain their existing workspaces.

The sidebar opens the KDS at `/kitchen/kds`; `/kitchen` redirects there. The
Kitchen shell follows the Manager/Admin FoodHub styling with a dark green
sidebar, white header, light background, and shared icons. Desktop navigation
can collapse; mobile navigation uses a drawer with Escape and keyboard focus
handling. Shell components and navigation live in `layouts/kitchen`, with the
role route defined in `routes/kitchenRoutes.tsx`.

The KDS reads live Gateway APIs (not manager monitoring preview data):

- Active station selection, with pagination when fetching the station list.
- Pending, Cooking, and Ready columns, independently paginated at 30 tasks each.
- Station summary and task details, options, notes, priority, and cooking times.
- Start cooking, complete cooking, cancel a Pending task with confirmation,
  and increase/decrease priority. Writes include the task rowversion.
- Refresh every five seconds while visible, plus manual refresh. This is polling.
- Server errors remain visible alongside previously loaded data; stale columns
  disable writes after failed refreshes. A conflict refreshes the workspace.

The API base URL is the existing `VITE_API_URL`, typically
`http://localhost:5000/api`. No backend or database changes are needed.

## Manual acceptance checks

Use a development environment for checks that change tasks:

1. Open `/kitchen` signed out: expect `/login`. Sign in as Kitchen: expect KDS.
2. Reload the page: expect server session verification before displaying KDS.
3. Open `/kitchen` with a different role: expect access to be blocked.
4. Select a station: all columns, counts, and the average use that station.
5. Open a task: verify notes/options and timestamps against the API response.
6. Start a Pending task and complete it: expect movement between columns and
   updated statistics. Buttons stay disabled through the write and refresh.
7. Cancel a Pending task: cancel the dialog first, then confirm; only confirmation
   sends the cancellation. Cooking/Ready cards have no cancel control.
8. Edit the same task in another client: a stale write should show a conflict
   and refresh, without silently retrying the operation.
9. Stop Gateway temporarily: expect error and retry controls rather than an
   empty-success screen; restore it and refresh to recover.
10. Test more than 30 tasks in one column and switch stations while on page 2:
    pagination should reset for the newly selected station.
11. Sign out: expect `/login`, cleared session, and no access to KDS on Back.

Batch cooking, remakes, Hold/fire-course, recipes, and item availability screens
are outside this first Auth and core KDS implementation.
