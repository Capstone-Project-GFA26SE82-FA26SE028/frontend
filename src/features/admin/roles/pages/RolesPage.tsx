import { Panel, secondaryButton } from '../../components/AdminUI'
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
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Roles &amp; permissions
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            View system roles and manage account assignments.
          </p>
        </div>
      </header>
      <RoleSummaryCards
        roleCount={roles.isError ? undefined : roles.data?.length}
        totals={summary.isError ? undefined : summary.data}
      />
      {(summary.isError || management.countsFailed) && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
        >
          Some account statistics could not be loaded.{' '}
          <button className="underline" onClick={management.retryStatistics}>
            Try again
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
            Loading roles…
          </p>
        ) : roles.isError ? (
          <Panel>
            <div className="space-y-3 p-8 text-center">
              <p role="alert" className="text-rose-600">
                {roleApiError(roles.error)}
              </p>
              <button
                className={secondaryButton}
                onClick={() => void roles.refetch()}
              >
                Try again
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
                Loading accounts…
              </p>
            ) : users.isError ? (
              <div className="space-y-3 p-8 text-center">
                <p role="alert" className="text-rose-600">
                  {roleApiError(users.error)}
                </p>
                <button
                  className={secondaryButton}
                  onClick={() => void users.refetch()}
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {users.isFetching && (
                  <p role="status" className="sr-only">
                    Refreshing accounts…
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
