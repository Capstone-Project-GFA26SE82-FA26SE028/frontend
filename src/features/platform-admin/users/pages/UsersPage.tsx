import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Icon } from '../../../../components/Icon/Icon'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { Panel } from '../../../../components/Panel/Panel'
import { UserFilters } from '../components/UserFilters'
import { UserTable } from '../components/UserTable'
import { UserDetailModal } from '../components/UserDetailModal'
import { UserActivationModal } from '../components/UserActivationModal'
import { UserForm } from '../components/UserForm'
import { UserEditModal } from '../components/UserEditModal'
import { UserSummaryCards } from '../components/UserSummaryCards'
import { useUserManagement } from '../hooks/useUsers'
import { userApiError } from '../api/userApi'

export function UsersPage() {
  const {
    query,
    setQuery,
    role,
    setRole,
    status,
    setStatus,
    page,
    setPage,
    users,
    counts,
    totals,
    admins,
    roles,
    rows,
    total,
    maxPage,
    form,
    setForm,
    target,
    setTarget,
    detailId,
    setDetailId,
    statusError,
    statusPending,
    save,
    openStatus,
    confirmStatus,
    retryStatistics,
  } = useUserManagement()
  return (
    <>
      <PageHeading
        title="Tài khoản người dùng"
        description="Quản lý thông tin tài khoản, vai trò và quyền truy cập."
        action={
          <button
            disabled={!roles.data?.length || roles.isError}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
            onClick={() => setForm(null)}
          >
            <Icon name="plus" size={18} />
            Thêm tài khoản
          </button>
        }
      />
      <UserSummaryCards
        totals={totals.isError ? undefined : totals.data}
        adminCount={admins.isError ? undefined : admins.data?.totalCount}
        hasError={totals.isError || admins.isError || counts.isError}
        onRetry={retryStatistics}
      />
      {roles.isError && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
        >
          Không thể tải danh sách vai trò.{' '}
          <button className="underline" onClick={() => void roles.refetch()}>
            Thử lại
          </button>
        </div>
      )}
      <Panel>
        <UserFilters
          query={query}
          role={role}
          status={status}
          roles={roles.data || []}
          counts={counts.isError ? undefined : counts.data}
          onQuery={setQuery}
          onRole={setRole}
          onStatus={setStatus}
        />
        {users.isPending ? (
          <p role="status" className="p-8 text-center text-slate-500">
            Đang tải tài khoản…
          </p>
        ) : users.isError ? (
          <div className="space-y-3 p-8 text-center">
            <p role="alert" className="text-rose-600">
              {userApiError(users.error)}
            </p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              onClick={() => void users.refetch()}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            {users.isFetching && (
              <p role="status" className="px-4 py-2 text-sm text-slate-500">
                Đang cập nhật tài khoản…
              </p>
            )}
            <UserTable
              visible={rows}
              onDetail={(user) => setDetailId(user.id)}
              onEdit={(user) => setForm(user.id)}
              onStatus={openStatus}
            />
            <Pagination
              locale="vi"
              total={total}
              page={Math.min(page, maxPage)}
              onPage={(nextPage) => {
                setPage(nextPage)
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia(
                    '(prefers-reduced-motion: reduce)',
                  ).matches
                    ? 'instant'
                    : 'smooth',
                })
              }}
            />
          </>
        )}
      </Panel>
      {form === null && (
        <UserForm
          user={null}
          roles={roles.data || []}
          onClose={() => setForm(undefined)}
          onSave={(values) => save(values)}
        />
      )}
      {typeof form === 'string' && (
        <UserEditModal
          id={form}
          onClose={() => setForm(undefined)}
          onSave={save}
        />
      )}
      {target && (
        <UserActivationModal
          user={target}
          error={statusError}
          pending={statusPending}
          onClose={() => setTarget(null)}
          onConfirm={confirmStatus}
        />
      )}
      {detailId && (
        <UserDetailModal id={detailId} onClose={() => setDetailId(undefined)} />
      )}
    </>
  )
}
