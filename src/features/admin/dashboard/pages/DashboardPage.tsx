import { DashboardWelcome } from '../components/DashboardWelcome'
import { useDashboard } from '../hooks/useDashboard'
import { DashboardStats } from '../components/DashboardStats'
import { StatusChart } from '../components/StatusChart'
import { DashboardAreas } from '../components/DashboardAreas'
import { DashboardSettings } from '../components/DashboardSettings'
import { DashboardSection } from '../components/DashboardSection'
export function DashboardPage() {
  const data = useDashboard()
  return (
    <div className="space-y-4">
      <h1 className="sr-only">Tổng quan</h1>
      <DashboardWelcome restaurantName={data.userCounts.data?.restaurantName} />
      <DashboardStats
        users={data.userCounts.data?.all ?? null}
        active={data.userCounts.data?.active ?? null}
        tables={data.layout.data ? data.tables.length : null}
        areas={data.layout.data ? data.areas.length : null}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {data.layout.data ? (
          <StatusChart
            title="Tình trạng bàn"
            icon="table"
            label="Tổng bàn"
            items={data.tableStatus}
          />
        ) : (
          <DashboardSection title="Bàn và khu vực" icon="table">
            {!data.restaurantId ? (
              <p className="text-sm text-slate-500">
                Tài khoản chưa được gán nhà hàng.
              </p>
            ) : data.layout.isError ? (
              <>
                <p role="alert" className="text-sm text-rose-700">
                  Không tải được dữ liệu bàn và khu vực.
                </p>
                <button
                  type="button"
                  className="mt-2 text-sm font-medium text-emerald-700 underline"
                  onClick={() => void data.layout.refetch()}
                >
                  Thử lại
                </button>
              </>
            ) : (
              <p role="status" className="text-sm text-slate-500">
                Đang tải bàn và khu vực…
              </p>
            )}
          </DashboardSection>
        )}
        {data.userCounts.data ? (
          <StatusChart
            title="Tài khoản người dùng"
            icon="users"
            label="Tổng tài khoản"
            items={data.userStatus}
          />
        ) : (
          <DashboardSection title="Tài khoản người dùng" icon="users">
            {data.userCounts.isError ? (
              <>
                <p role="alert" className="text-sm text-rose-700">
                  Không tải được số liệu tài khoản.
                </p>
                <button
                  type="button"
                  className="mt-2 text-sm font-medium text-emerald-700 underline"
                  onClick={() => void data.userCounts.refetch()}
                >
                  Thử lại
                </button>
              </>
            ) : (
              <p role="status" className="text-sm text-slate-500">
                Đang tải số liệu tài khoản…
              </p>
            )}
          </DashboardSection>
        )}
        {data.layout.data && (
          <DashboardAreas areas={data.areas} tables={data.tables} />
        )}
        <DashboardSettings fees={data.currentFees} methods={data.methods} />
      </div>
    </div>
  )
}
