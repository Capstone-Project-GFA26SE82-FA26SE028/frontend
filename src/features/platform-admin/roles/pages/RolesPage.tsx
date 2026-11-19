import { Panel } from '../../../../components/Panel/Panel'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { RoleTable } from '../components/RoleTable'
import { RoleUsersTable } from '../components/RoleUsersTable'
import { RoleUserFilters } from '../components/RoleUserFilters'
import { RoleTabs } from '../components/RoleTabs'
import { RoleSummaryCards } from '../components/RoleSummaryCards'
import { RoleAssignmentModal } from '../components/RoleAssignmentModal'
import { useRoleManagement } from '../hooks/useRoleManagement'
import { roleApiError } from '../api/roleApi'

export function RolesPage() {
  const management = useRoleManagement()
  const { roles, users, summary } = management
  return (
    <>
      <PageHeading
        title="Vai trò và quyền hạn"
        description="Xem vai trò hệ thống và quản lý việc gán vai trò cho tài khoản."
      />
      <RoleSummaryCards
        roleCount={roles.isError ? undefined : roles.data?.length}
        totals={summary.isError ? undefined : summary.data}
      />
      {(summary.isError || management.countsFailed) && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
        >
          Không thể tải một số thống kê tài khoản.{' '}
          <button className="underline" onClick={management.retryStatistics}>
            Thử lại
          </button>
        </div>
      )}
      <RoleTabs tab={management.tab} onChange={management.changeTab} />
      <div
        role="tabpanel"
        id={'panel-' + management.tab}
        aria-labelledby={'tab-' + management.tab}
      >
        {roles.isPending ? (
          <p role="status" className="p-8 text-center text-slate-500">
            Đang tải vai trò…
          </p>
        ) : roles.isError ? (
          <Panel>
            <div className="space-y-3 p-8 text-center">
              <p role="alert" className="text-rose-600">
                {roleApiError(roles.error)}
              </p>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                onClick={() => void roles.refetch()}
              >
                Thử lại
              </button>
            </div>
          </Panel>
        ) : management.tab === 'roles' ? (
          <RoleTable
            roles={roles.data}
            counts={management.counts}
            onViewUsers={management.viewRoleUsers}
          />
        ) : (
          <Panel>
            <RoleUserFilters
              query={management.query}
              role={management.role}
              status={management.status}
              roles={roles.data}
              onQuery={management.changeQuery}
              onRole={management.changeRole}
              onStatus={management.changeStatus}
            />
            {users.isPending ? (
              <p role="status" className="p-8 text-center text-slate-500">
                Đang tải tài khoản…
              </p>
            ) : users.isError ? (
              <div className="space-y-3 p-8 text-center">
                <p role="alert" className="text-rose-600">
                  {roleApiError(users.error)}
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
                  <p role="status" className="sr-only">
                    Đang cập nhật tài khoản…
                  </p>
                )}
                <RoleUsersTable
                  users={users.data?.items || []}
                  roles={roles.data}
                  total={users.data?.totalCount || 0}
                  page={management.page}
                  pageSize={management.pageSize}
                  busy={users.isPlaceholderData}
                  onPage={management.changePage}
                  onSelect={management.selectUser}
                />
              </>
            )}
          </Panel>
        )}
      </div>
      {management.selectedUser && (
        <RoleAssignmentModal
          key={management.selectedUser.userId}
          user={management.selectedUser}
          roles={roles.data || []}
          onClose={management.closeModal}
          onSave={management.saveAssignment}
        />
      )}
    </>
  )
}
