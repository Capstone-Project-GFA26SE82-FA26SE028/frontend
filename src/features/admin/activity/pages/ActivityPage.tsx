import {
  PageHeading,
  Panel,
  Pagination,
  secondaryButton,
} from '../../components/AdminUI'
import { useActivity } from '../hooks/useActivity'
import { activityApiError } from '../api/activityApi'
import { ActivityFilters } from '../components/ActivityFilters'
import { ActivityTable } from '../components/ActivityTable'
import { ActivityDetailModal } from '../components/ActivityDetailModal'
export function ActivityPage() {
  const activity = useActivity()
  const { logs } = activity
  return (
    <>
      <PageHeading
        title="Activity logs"
        description="Review recorded account and sign-in activity."
        action={
          <button
            className={secondaryButton}
            disabled={logs.isFetching}
            onClick={() => void logs.refetch()}
          >
            Refresh
          </button>
        }
      />
      <Panel>
        <ActivityFilters userId={activity.userId} onApply={activity.filter} />
        {logs.isPending ? (
          <p role="status" className="p-8 text-center text-slate-500">
            Loading activity logs?
          </p>
        ) : logs.isError ? (
          <div className="space-y-3 p-8 text-center">
            <p role="alert" className="text-rose-600">
              {activityApiError(logs.error)}
            </p>
            <button
              className={secondaryButton}
              onClick={() => void logs.refetch()}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {logs.isFetching && (
              <p role="status" className="sr-only">
                Refreshing activity logs?
              </p>
            )}
            <fieldset
              disabled={logs.isPlaceholderData}
              aria-busy={logs.isFetching}
              className="min-w-0"
            >
              <ActivityTable
                items={logs.data.items}
                onDetail={activity.setDetail}
                onUser={activity.filter}
              />
              <Pagination
                locale="en"
                total={activity.total}
                page={activity.page}
                size={activity.pageSize}
                onPage={activity.changePage}
              />
            </fieldset>
          </>
        )}
      </Panel>
      {activity.detail && (
        <ActivityDetailModal
          log={activity.detail}
          onClose={() => activity.setDetail(null)}
        />
      )}
    </>
  )
}
