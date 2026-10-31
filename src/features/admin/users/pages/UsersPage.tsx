import { secondaryButton, Pagination } from '../../components/AdminUI'
import { Panel } from '../../../../components/Panel/Panel'
import { UserFilters } from '../components/UserFilters'
import { UserTable } from '../components/UserTable'
import { UserDetailModal } from '../components/UserDetailModal'
import { UserStatusModal } from '../components/UserStatusModal'
import { UserForm } from '../components/UserForm'
import { UserEditModal } from '../components/UserEditModal'
import { UserPageHeader } from '../components/UserPageHeader'
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
      <UserPageHeader
        canCreate={!!roles.data?.length && !roles.isError}
        onCreate={() => setForm(null)}
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
              className={secondaryButton}
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
              size={10}
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
        <UserStatusModal
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
