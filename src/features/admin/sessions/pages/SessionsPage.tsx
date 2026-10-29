import { useState } from 'react'
import type { LoginSession } from '../types/types'
import { SessionDetailModal } from '../components/SessionDetailModal'
import { SessionFilters } from '../components/SessionFilters'
import { SessionTable } from '../components/SessionTable'
import { SessionRevokeModal } from '../components/SessionRevokeModal'
import { useSessions } from '../hooks/useSessions'
import { sessionApiError } from '../api/sessionApi'
import {
  Panel,
  PageHeading,
  Pagination,
  secondaryButton,
} from '../../components/AdminUI'

export function SessionsPage() {
  const [detail, setDetail] = useState<LoginSession | null>(null)
  const management = useSessions()
  const { sessions, roles, counts } = management
  return (
    <>
      <PageHeading
        title="Phiên đăng nhập"
        description="Xem hoạt động đăng nhập và quản lý các phiên của bạn."
        action={
          <button
            className={secondaryButton}
            onClick={() => management.openRevoke('all')}
          >
            Đăng xuất mọi phiên của tôi
          </button>
        }
      />
      {(counts.isError || roles.isError) && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
        >
          Không thể tải một số bộ lọc hoặc số lượng phiên.{' '}
          <button
            className="underline"
            onClick={() => {
              void counts.refetch()
              void roles.refetch()
            }}
          >
            Thử lại
          </button>
        </div>
      )}
      <Panel>
        <SessionFilters
          search={management.search}
          status={management.status}
          role={management.role}
          date={management.date}
          device={management.device}
          mine={management.mine}
          roles={roles.data || []}
          counts={counts.isError ? undefined : counts.data}
          onSearch={management.onSearch}
          onStatus={management.onStatus}
          onRole={management.onRole}
          onDate={management.onDate}
          onDevice={management.onDevice}
          onMine={management.onMine}
          onReset={management.resetFilters}
        />
        {sessions.isPending ? (
          <p role="status" className="p-8 text-center text-slate-500">
            Đang tải phiên đăng nhập…
          </p>
        ) : sessions.isError ? (
          <div className="space-y-3 p-8 text-center">
            <p role="alert" className="text-rose-600">
              {sessionApiError(sessions.error)}
            </p>
            <button
              className={secondaryButton}
              onClick={() => void sessions.refetch()}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            {sessions.isFetching && (
              <p role="status" className="sr-only">
                Đang cập nhật phiên đăng nhập…
              </p>
            )}
            <fieldset
              disabled={sessions.isPlaceholderData}
              aria-busy={sessions.isFetching}
              className="min-w-0"
            >
              <SessionTable
                sessions={sessions.data?.items || []}
                roles={roles.data || []}
                onDetail={setDetail}
              />
              <Pagination
                locale="vi"
                size={management.pageSize}
                total={management.total}
                page={management.page}
                onPage={management.changePage}
              />
            </fieldset>
          </>
        )}
      </Panel>
      {detail && (
        <SessionDetailModal
          session={
            sessions.data?.items.find(
              (item) => item.userSessionId === detail.userSessionId,
            ) || detail
          }
          roles={roles.data || []}
          actorId={management.actorId}
          onClose={() => setDetail(null)}
          onRevoke={(session) => {
            setDetail(null)
            management.openRevoke(session)
          }}
        />
      )}
      {management.target && (
        <SessionRevokeModal
          target={management.target}
          pending={management.pending}
          error={management.error}
          onClose={management.closeRevoke}
          onConfirm={() => void management.confirmRevoke()}
        />
      )}
    </>
  )
}
