import { Modal } from '../../../../components/Modal/Modal'

import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { Panel } from '../../../../components/Panel/Panel'
import { AreaFilters } from '../components/AreaFilters'
import { AreaTable } from '../components/AreaTable'
import { AreaForm } from '../components/AreaForm'
import { AreaDetail } from '../components/AreaDetail'
import { useAreas } from '../hooks/useAreas'
import { areaError } from '../api/areaApi'
export function AreasPage() {
  const m = useAreas(),
    { target, detail, mutation } = m
  const restaurants = m.restaurants.data || []
  const area = detail.data
  return (
    <>
      <PageHeading
        title="Khu vực nhà hàng"
        description="Quản lý khu vực phục vụ của từng nhà hàng."
        action={
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
            onClick={() => m.open('create')}
          >
            + Thêm khu vực
          </button>
        }
      />
      {m.restaurants.isError && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          Không thể tải tên nhà hàng.{' '}
          <button
            className="underline"
            onClick={() => void m.restaurants.refetch()}
          >
            Thử lại
          </button>
        </div>
      )}
      <Panel>
        <AreaFilters
          search={m.search}
          onSearch={m.setSearch}
          status={m.status}
          onStatus={m.filterStatus}
          restaurantId={m.restaurantId}
          onRestaurant={m.filterRestaurant}
          restaurants={restaurants}
          onReset={m.reset}
        />
        {m.list.isPending ? (
          <p role="status" className="p-8 text-center text-slate-500">
            Đang tải khu vực…
          </p>
        ) : m.list.isError ? (
          <div className="space-y-3 p-8 text-center">
            <p role="alert">{areaError(m.list.error)}</p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              onClick={() => void m.list.refetch()}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <fieldset
            className="min-w-0"
            disabled={m.list.isPlaceholderData}
            aria-busy={m.list.isFetching}
          >
            <AreaTable
              items={m.list.data.items}
              restaurants={restaurants}
              onAction={m.open}
            />
            <Pagination
              locale="vi"
              total={m.list.data.totalCount}
              page={m.page}
              onPage={m.changePage}
            />
          </fieldset>
        )}
      </Panel>
      {target && (
        <Modal
          size={
            target.mode === 'create' || target.mode === 'edit'
              ? 'wide'
              : 'default'
          }
          title={
            target.mode === 'create'
              ? 'Thêm khu vực'
              : target.mode === 'edit'
                ? 'Sửa khu vực'
                : target.mode === 'view'
                  ? 'Chi tiết khu vực'
                  : target.mode === 'delete'
                    ? 'Xóa khu vực'
                    : area?.isActive
                      ? 'Ngừng hoạt động khu vực'
                      : 'Kích hoạt khu vực'
          }
          closeLabel="Đóng"
          onClose={m.close}
        >
          {target.mode === 'create' ? (
            m.restaurants.isPending ? (
              <p role="status" className="p-6">
                Đang tải nhà hàng…
              </p>
            ) : m.restaurants.isError ? (
              <p className="p-6">
                Chưa tải được danh sách nhà hàng. Vui lòng đóng và thử lại.
              </p>
            ) : restaurants.length === 0 ? (
              <p className="p-6">Tạo nhà hàng trước khi thêm khu vực.</p>
            ) : (
              <AreaForm
                restaurants={restaurants}
                restaurantId={m.restaurantId}
                pending={mutation.isPending}
                onClose={m.close}
                onSave={(values) =>
                  mutation.mutateAsync({ kind: 'save', values })
                }
              />
            )
          ) : detail.isPending ? (
            <p role="status" className="p-6">
              Đang tải khu vực…
            </p>
          ) : detail.isError ? (
            <div className="space-y-3 p-6">
              <p role="alert">{areaError(detail.error)}</p>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                onClick={() => void detail.refetch()}
              >
                Thử lại
              </button>
            </div>
          ) : (
            area &&
            (target.mode === 'view' ? (
              <AreaDetail
                area={area}
                restaurantName={
                  restaurants.find((r) => r.restaurantId === area.restaurantId)
                    ?.restaurantName || 'Chưa có thông tin nhà hàng'
                }
                onClose={m.close}
                onEdit={() => m.open('edit', area.areaId)}
              />
            ) : target.mode === 'edit' ? (
              <AreaForm
                key={area.areaId}
                area={area}
                restaurants={restaurants}
                restaurantId={area.restaurantId}
                pending={mutation.isPending}
                onClose={m.close}
                onSave={(values) =>
                  mutation.mutateAsync({
                    kind: 'save',
                    values,
                    id: area.areaId,
                  })
                }
              />
            ) : (
              <div className="space-y-5 p-6">
                <p className="break-words text-sm text-slate-600">
                  {target.mode === 'delete'
                    ? 'Xóa ' +
                      area.areaName +
                      '? Không thể xóa khu vực còn bàn.'
                    : area.isActive
                      ? 'Ngừng hoạt động ' +
                        area.areaName +
                        '? Không thể thực hiện khi còn phiên phục vụ đang mở.'
                      : 'Kích hoạt ' + area.areaName + '?'}
                </p>
                {mutation.isError && (
                  <p
                    role="alert"
                    className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
                  >
                    {areaError(mutation.error)}
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    disabled={mutation.isPending}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                    onClick={m.close}
                  >
                    Hủy
                  </button>
                  <button
                    disabled={mutation.isPending}
                    className={
                      target.mode === 'delete'
                        ? 'rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50'
                        : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40'
                    }
                    onClick={() =>
                      mutation.mutate(
                        target.mode === 'delete'
                          ? { kind: 'delete', id: area.areaId }
                          : {
                              kind: 'status',
                              id: area.areaId,
                              isActive: !area.isActive,
                            },
                      )
                    }
                  >
                    {mutation.isPending
                      ? 'Đang lưu…'
                      : target.mode === 'delete'
                        ? 'Xóa'
                        : area.isActive
                          ? 'Ngừng hoạt động'
                          : 'Kích hoạt'}
                  </button>
                </div>
              </div>
            ))
          )}
        </Modal>
      )}
    </>
  )
}
