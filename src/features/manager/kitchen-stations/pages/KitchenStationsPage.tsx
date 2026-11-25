import { useState } from 'react'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Panel } from '../../../../components/Panel/Panel'
import { Modal } from '../../../../components/Modal/Modal'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { SearchField } from '../../../../components/SearchField/SearchField'
import { useDebounce } from '../../../../hooks/useDebounce'
import { QueryState } from '../../dishes/components/QueryState'
import { StationTabs } from '../components/StationTabs'
import { StationForm } from '../components/StationForm'
import {
  buttonClass,
  inputClass,
  primaryClass,
  tableClass,
} from '../constants/kitchenStation'
import {
  useKitchenStations,
  useStationMutation,
} from '../hooks/useKitchenStations'
import type { KitchenStation } from '../types/kitchenStation'

export function KitchenStationsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<{ station?: KitchenStation } | null>(null)
  const [target, setTarget] = useState<KitchenStation | null>(null)
  const list = useKitchenStations(useDebounce(search, 300), status, page)
  const mutation = useStationMutation(() => {
    setForm(null)
    setTarget(null)
  })
  return (
    <>
      <PageHeading
        eyebrow="Thiết lập bếp"
        title="Trạm bếp"
        description="Quản lý trạm chế biến và phân món cho từng trạm."
        action={
          <button
            className={primaryClass}
            onClick={() => {
              mutation.reset()
              setForm({})
            }}
          >
            Thêm trạm bếp
          </button>
        }
      />
      <StationTabs />
      <Panel>
        <div className="flex flex-wrap gap-3 p-4">
          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Tìm mã hoặc tên trạm…"
          />
          <select
            aria-label="Trạng thái trạm"
            className={`${inputClass} sm:w-56`}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select>
          <button className={buttonClass} onClick={() => void list.refetch()}>
            Làm mới
          </button>
        </div>
        <QueryState
          pending={list.isPending}
          error={list.error}
          retry={() => void list.refetch()}
          empty={!list.data?.items.length}
        >
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th>Mã trạm</th>
                  <th>Tên trạm</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {list.data?.items.map((station) => (
                  <tr
                    key={station.kitchenStationId}
                    className="border-t border-slate-100"
                  >
                    <td>{station.kitchenStationCode}</td>
                    <td>{station.kitchenStationName}</td>
                    <td>
                      {station.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className={buttonClass}
                          onClick={() => {
                            mutation.reset()
                            setForm({ station })
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className={buttonClass}
                          onClick={() => {
                            mutation.reset()
                            setTarget(station)
                          }}
                        >
                          {station.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QueryState>
        <Pagination
          total={list.data?.totalCount || 0}
          page={page}
          onPage={setPage}
        />
      </Panel>
      {form && (
        <Modal
          title={form.station ? 'Sửa trạm bếp' : 'Thêm trạm bếp'}
          closeLabel="Đóng"
          onClose={() => {
            if (!mutation.isPending) setForm(null)
          }}
        >
          <StationForm
            station={form.station}
            pending={mutation.isPending}
            onClose={() => setForm(null)}
            onSave={(body) =>
              mutation.mutate({
                kind: 'save',
                id: form.station?.kitchenStationId,
                body,
              })
            }
          />
        </Modal>
      )}
      {target && (
        <Modal
          title="Đổi trạng thái trạm bếp?"
          closeLabel="Đóng"
          onClose={() => {
            if (!mutation.isPending) setTarget(null)
          }}
        >
          <div className="space-y-5 p-6">
            <p>
              {target.isActive
                ? `Ngừng hoạt động trạm ${target.kitchenStationName}? Món đang gán trạm này sẽ không thể nhận đơn mới. Tác vụ bếp hiện có được giữ nguyên.`
                : `Kích hoạt trạm ${target.kitchenStationName}?`}
            </p>
            <div className="flex justify-end gap-2">
              <button
                disabled={mutation.isPending}
                className={buttonClass}
                onClick={() => setTarget(null)}
              >
                Hủy
              </button>
              <button
                disabled={mutation.isPending}
                className={primaryClass}
                onClick={() =>
                  mutation.mutate({
                    kind: 'status',
                    id: target.kitchenStationId,
                    isActive: !target.isActive,
                  })
                }
              >
                Xác nhận
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
