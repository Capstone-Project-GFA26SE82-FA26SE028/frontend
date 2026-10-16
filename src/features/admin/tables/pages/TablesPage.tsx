import { TableCard } from '../components/TableCard'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useTables } from '../hooks/useTables'
import type { RestaurantTable } from '../schema'
import { RestaurantHeading } from '../../components/RestaurantHeading'
import { TableForm } from '../components/TableForm'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Panel,
  SearchField,
  EmptyState,
  ConfirmAction,
  primaryButton,
} from '../../components/AdminUI'
import { matches } from '../../utils'
export function TablesPage() {
  const { state, saveTable, deleteTable } = useTables()
  const [edit, setEdit] = useState<RestaurantTable | null>(null)
  const [remove, setRemove] = useState<RestaurantTable | null>(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const { query } = useOutletContext<{ query: string }>()
  const rows = state.tables.filter(
    (r) =>
      matches(search, r.code, r.name) &&
      matches(query, r.code, r.name) &&
      (!filter ||
        (filter === 'unassigned'
          ? !state.areas.some((a) => a.id === r.areaId)
          : r.areaId === filter)),
  )
  return (
    <>
      <RestaurantHeading
        title="Danh sách bàn"
        description="Sắp xếp bàn, sức chứa và khu vực phục vụ"
        action={
          <button
            className={primaryButton}
            onClick={() =>
              setEdit({
                id: crypto.randomUUID(),
                code: '',
                name: '',
                active: true,
                capacity: 4,
                areaId: '',
                note: '',
                busy: false,
                history: false,
              })
            }
          >
            + Thêm bàn
          </button>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Panel className="p-5">
          <p className="text-sm text-slate-500">Tổng bàn</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">
            {state.tables.length}
          </p>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm text-slate-500">Đang sử dụng</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">
            {state.tables.filter((r) => r.active).length}
          </p>
        </Panel>
      </div>
      <Panel>
        <div className="flex flex-wrap gap-3 p-4">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Tìm theo mã hoặc tên…"
          />
        </div>
        <div
          className="flex gap-2 overflow-x-auto border-y border-slate-100 px-4 py-3"
          aria-label="Lọc theo khu vực"
        >
          {[
            { id: '', name: 'Tất cả' },
            ...state.areas,
            { id: 'unassigned', name: 'Chưa phân khu vực' },
          ].map((area) => (
            <button
              key={area.id}
              aria-pressed={filter === area.id}
              onClick={() => setFilter(area.id)}
              className={
                'min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition-colors ' +
                (filter === area.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700')
              }
            >
              {area.name}
            </button>
          ))}
        </div>
        <div className="space-y-8 bg-slate-50/50 p-3 sm:p-5">
          {[
            ...state.areas,
            { id: 'unassigned', name: 'Chưa phân khu vực' },
          ].map((area) => {
            const tables = rows.filter((t) =>
              area.id === 'unassigned'
                ? !state.areas.some((a) => a.id === t.areaId)
                : t.areaId === area.id,
            )
            if (!tables.length) return null
            return (
              <section key={area.id} aria-label={area.name}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-base font-semibold text-slate-700">
                    {area.name}
                  </h2>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500">
                    {tables.length} bàn
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {tables.map((table) => (
                    <TableCard
                      key={table.id}
                      table={table}
                      onEdit={() => setEdit(table)}
                      onDelete={() => {
                        setError('')
                        setRemove(table)
                      }}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
        {!rows.length && <EmptyState />}
        <p className="border-t border-slate-100 p-4 text-sm text-slate-500">
          {rows.length} kết quả
        </p>
      </Panel>
      {edit && (
        <Modal title="Thông tin bàn" onClose={() => setEdit(null)}>
          <TableForm
            value={edit}
            areas={state.areas}
            onSave={saveTable}
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
            const message = deleteTable(remove.id)
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
