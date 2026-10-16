import { useOutletContext } from 'react-router-dom'
import type { AdminOutletContext } from '../../../../layouts/admin/AdminLayout'
import { SessionFilters } from '../components/SessionFilters'
import { SessionTable } from '../components/SessionTable'
import { useSessions } from '../hooks/useSessions'
import {
  Panel,
  PageHeading,
  Pagination,
  secondaryButton,
} from '../../components/AdminUI'
export function SessionsPage() {
  const { query } = useOutletContext<AdminOutletContext>()
  const sessions = useSessions(query)
  return (
    <>
      <PageHeading
        eyebrow="Quản lý tài khoản"
        title="Phiên đăng nhập"
        description="Tra cứu hoạt động đăng nhập · Dữ liệu phiên mô phỏng, chỉ xem"
      />
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <h2 className="text-lg font-semibold">Danh sách phiên đăng nhập</h2>
          <button className={secondaryButton} onClick={sessions.resetFilters}>
            Đặt lại bộ lọc
          </button>
        </div>
        <SessionFilters
          search={sessions.search}
          status={sessions.status}
          role={sessions.role}
          date={sessions.date}
          roles={sessions.roles}
          total={sessions.matchingCount}
          active={sessions.activeCount}
          onSearch={sessions.onSearch}
          onStatus={sessions.onStatus}
          onRole={sessions.onRole}
          onDate={sessions.onDate}
        />
        <SessionTable sessions={sessions.visible} />
        <Pagination
          total={sessions.total}
          page={sessions.current}
          onPage={sessions.setPage}
        />
      </Panel>
    </>
  )
}
