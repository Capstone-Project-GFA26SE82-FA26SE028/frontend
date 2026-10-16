import { AreaFilters } from '../components/AreaFilters'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAreas } from '../hooks/useAreas'
import type { Area } from '../schema'
import { RestaurantHeading } from '../../components/RestaurantHeading'
import { AreaForm } from '../components/AreaForm'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Panel,
  Badge,
  EmptyState,
  ConfirmAction,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
import { matches } from '../../utils'
export function AreasPage() {
  const { state, saveArea, deleteArea } = useAreas()
  const [edit, setEdit] = useState<Area | null>(null)
  const [remove, setRemove] = useState<Area | null>(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const { query } = useOutletContext<{ query: string }>()
  const matchingAreas = state.areas.filter(
    (r) => matches(search, r.code, r.name) && matches(query, r.code, r.name),
  )
  const rows = matchingAreas.filter(
    (r) => !filter || String(r.active) === filter,
  )
  return (
    <>
      <RestaurantHeading
        title="Khu vực nhà hàng"
        description="Tổ chức không gian phục vụ của nhà hàng"
        action={
          <button
            className={primaryButton}
            onClick={() =>
              setEdit({
                id: crypto.randomUUID(),
                code: '',
                name: '',
                active: true,
                description: '',
              })
            }
          >
            + Thêm khu vực
          </button>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Panel className="p-5">
          <p className="text-sm text-slate-500">Tổng khu vực</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">
            {state.areas.length}
          </p>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm text-slate-500">Đang sử dụng</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">
            {state.areas.filter((r) => r.active).length}
          </p>
        </Panel>
      </div>
      <Panel>
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-semibold">Danh sách khu vực</h2>
        </div>
        <AreaFilters
          search={search}
          status={filter}
          total={matchingAreas.length}
          active={matchingAreas.filter((a) => a.active).length}
          onSearch={setSearch}
          onStatus={setFilter}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['Khu vực', 'Mô tả · Số bàn', 'Trạng thái', 'Thao tác'].map(
                  (h) => (
                    <th key={h} className="px-5 py-4 font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{r.name}</p>
                    <p className="mt-1 text-slate-400">{r.code}</p>
                  </td>
                  <td className="px-5 py-4">
                    {r.description || '—'}
                    <p className="mt-1 text-slate-400">
                      {state.tables.filter((t) => t.areaId === r.id).length} bàn
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={r.active ? 'green' : 'slate'}>
                      {r.active ? 'Đang sử dụng' : 'Ngừng sử dụng'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        className={secondaryButton}
                        onClick={() => setEdit(r)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className={secondaryButton}
                        onClick={() => {
                          setError('')
                          setRemove(r)
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <EmptyState />}
        <p className="border-t border-slate-100 p-4 text-sm text-slate-500">
          {rows.length} kết quả
        </p>
      </Panel>
      {edit && (
        <Modal title="Thông tin khu vực" onClose={() => setEdit(null)}>
          <AreaForm
            value={edit}
            onSave={saveArea}
            onClose={() => setEdit(null)}
          />
        </Modal>
      )}
      {remove && (
        <ConfirmAction
          title={'Xóa ' + remove.name + '?'}
          description="Chỉ xóa khi dữ liệu không còn được sử dụng. Thao tác sẽ được ghi vào nhật ký."
          onClose={() => setRemove(null)}
          onConfirm={() => {
            const message = deleteArea(remove.id)
            if (message) setError(message)
            else setRemove(null)
          }}
        >
          {error && (
            <p role="alert" className="text-rose-600">
              {error}
            </p>
          )}
        </ConfirmAction>
      )}
    </>
  )
}
