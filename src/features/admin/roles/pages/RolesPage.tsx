import { useOutletContext } from 'react-router-dom'
import type { AdminOutletContext } from '../../../../layouts/admin/AdminLayout'
import { Notice, secondaryButton } from '../../components/AdminUI'
import { RoleTable } from '../components/RoleTable'
import { RoleUsersTable } from '../components/RoleUsersTable'
import { RoleTabs } from '../components/RoleTabs'
import { RoleSummaryCards } from '../components/RoleSummaryCards'
import { RoleAssignmentModal } from '../components/RoleAssignmentModal'
import { useRoleManagement } from '../hooks/useRoleManagement'

export function RolesPage() {
  const { query: globalQuery } = useOutletContext<AdminOutletContext>()
  const management = useRoleManagement(globalQuery)
  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Vai trò & phân quyền
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tra cứu trách nhiệm của từng vai trò và phân công tài khoản.
          </p>
        </div>
        <button className={secondaryButton} onClick={management.exportRoles}>
          Xuất danh sách vai trò
        </button>
      </header>
      <RoleSummaryCards users={management.allUsers} />
      {management.notice && <Notice>{management.notice}</Notice>}
      <p className="mb-5 text-sm leading-6 text-slate-500">
        Phạm vi nghiệp vụ dưới đây là dự kiến. Quyền truy cập thực tế sẽ do BE
        kiểm tra khi tích hợp API.
      </p>
      <RoleTabs tab={management.tab} onChange={management.changeTab} />
      <div
        role="tabpanel"
        id={'panel-' + management.tab}
        aria-labelledby={'tab-' + management.tab}
      >
        {management.tab === 'roles' ? (
          <RoleTable users={management.allUsers} query={globalQuery} />
        ) : (
          <RoleUsersTable
            users={management.users}
            matchingUsers={management.matchingUsers}
            status={management.status}
            onStatus={management.changeStatus}
            restaurants={management.restaurants}
            role={management.role}
            onRole={management.changeRole}
            query={management.query}
            onQuery={management.changeQuery}
            page={management.page}
            onPage={management.changePage}
            selected={management.selected}
            onSelect={management.selectUser}
          />
        )}
      </div>
      {management.selectedUser && (
        <RoleAssignmentModal
          key={management.selectedUser.id}
          user={management.selectedUser}
          restaurants={management.restaurants}
          onClose={management.closeModal}
          onSave={management.saveAssignment}
        />
      )}
    </>
  )
}
