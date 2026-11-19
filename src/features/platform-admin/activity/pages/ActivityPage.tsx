import { Icon } from '../../../../components/Icon/Icon'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { Panel } from '../../../../components/Panel/Panel'
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
        title="Nhật ký hoạt động"
        description="Xem hoạt động tài khoản và đăng nhập đã ghi nhận."
        action={
          <button
            disabled={logs.isFetching}
            onClick={() => void logs.refetch()}
            type="button"
            title="Làm mới"
            aria-label="Làm mới"
            aria-busy={logs.isFetching}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40"
          >
            <Icon
              name="refresh"
              size={18}
              className={
                logs.isFetching ? 'animate-spin motion-reduce:animate-none' : ''
              }
            />
          </button>
        }
      />
      <Panel>
        <ActivityFilters userId={activity.userId} onApply={activity.filter} />
        {logs.isPending ? (
          <p role="status" className="p-8 text-center text-slate-500">
            Đang tải nhật ký hoạt động…
          </p>
        ) : logs.isError ? (
          <div className="space-y-3 p-8 text-center">
            <p role="alert" className="text-rose-600">
              {activityApiError(logs.error)}
            </p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              onClick={() => void logs.refetch()}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            {logs.isFetching && (
              <p role="status" className="sr-only">
                Đang cập nhật nhật ký hoạt động…
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
                locale="vi"
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
