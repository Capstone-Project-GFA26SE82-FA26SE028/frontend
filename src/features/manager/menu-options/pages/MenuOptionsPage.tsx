import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Panel } from '../../../../components/Panel/Panel'
import { MenuOptionDialog } from '../components/MenuOptionDialog'
import { useMenuOptions } from '../hooks/useMenuOptions'
import type { Mode } from '../types/menuOption'
import { input, title, menuOptionError } from '../utils/menuOptions'

export function MenuOptionsPage() {
  const user = useAppSelector((s) => s.auth.session?.user)
  return (
    <OptionsWorkspace
      key={user?.userId + ':' + user?.restaurantId}
      scope={user?.userId + ':' + user?.restaurantId}
    />
  )
}
function OptionsWorkspace({ scope }: { scope: string }) {
  const model = useMenuOptions(scope)
  const {
    mode,
    setMode,
    itemId,
    setItemId,
    dialog,
    groups,
    items,
    records,
    source,
    mutation,
    id,
    groupName,
    name,
    open,
    showList,
  } = model
  return (
    <>
      <PageHeading
        title="Tùy chọn món"
        description="Quản lý nhóm tùy chọn, phụ thu và số lượng được chọn cho từng món."
      />
      <nav aria-label="Tùy chọn món" className="mb-5 flex flex-wrap gap-2">
        {(Object.keys(title) as Mode[]).map((value) => (
          <button
            key={value}
            aria-pressed={mode === value}
            className={mode === value ? 'btn-primary' : 'btn-secondary'}
            onClick={() => {
              mutation.reset()
              setMode(value)
            }}
          >
            {title[value]}
          </button>
        ))}
      </nav>
      <Panel className="space-y-4 p-4">
        {mode === 'links' && (
          <label className="block max-w-md">
            Món áp dụng
            <select
              className={input}
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
            >
              <option value="">Chọn món</option>
              {items.data?.map((item) => (
                <option key={item.itemId} value={item.itemId}>
                  {item.itemName}
                </option>
              ))}
            </select>
          </label>
        )}
        {showList && (
          <button
            className="btn-primary"
            disabled={!source.isSuccess || mutation.isPending}
            onClick={() => open('save')}
          >
            {mode === 'links'
              ? 'Gán nhóm'
              : 'Thêm ' + title[mode].toLowerCase()}
          </button>
        )}
        {[groups, items, records]
          .filter(
            (_, i) =>
              i === 0 ||
              (i === 1 ? mode === 'links' : showList && mode !== 'groups'),
          )
          .map(
            (query, i) =>
              query.isError && (
                <p role="alert" key={i}>
                  {menuOptionError(query.error)}{' '}
                  <button
                    className="underline"
                    onClick={() => void query.refetch()}
                  >
                    Tải lại
                  </button>
                </p>
              ),
          )}
        {!dialog && mutation.isError && (
          <p role="alert" className="text-rose-700">
            {menuOptionError(mutation.error)}
          </p>
        )}
        {showList && source.isPending && <p role="status">Đang tải…</p>}
        {showList && source.isSuccess && !source.data.length && (
          <p>Chưa có dữ liệu.</p>
        )}
        {showList && !!source.data?.length && (
          <ul className="divide-y">
            {source.data.map((row) => (
              <li
                key={id(row)}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <strong>{name(row)}</strong>
                  {mode === 'options' && (
                    <p className="text-sm">
                      {groupName(row)} ·{' '}
                      {new Intl.NumberFormat('vi-VN').format(
                        row.extraPrice ?? 0,
                      )}{' '}
                      ₫ ·{' '}
                      {row.availability === 'Available'
                        ? 'Đang bán'
                        : row.availability === 'OutOfStock'
                          ? 'Hết hàng'
                          : 'Ngừng bán'}
                    </p>
                  )}
                  {mode === 'links' && (
                    <p className="text-sm">
                      Bắt buộc {row.minSelection ?? 0} · Tối đa{' '}
                      {row.maxSelection ?? 0}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {mode === 'options' && (
                    <Link
                      className="btn-secondary"
                      to={`/manager/recipes?optionId=${row.optionId}`}
                    >
                      Công thức
                    </Link>
                  )}
                  <button
                    className="btn-secondary"
                    disabled={mutation.isPending}
                    onClick={() => open('save', row)}
                  >
                    Sửa
                  </button>
                  {mode === 'options' && (
                    <select
                      className="rounded-xl border px-2"
                      aria-label={`Trạng thái ${name(row)}`}
                      value={row.availability}
                      disabled={mutation.isPending}
                      onChange={(e) =>
                        mutation.mutate({
                          method: 'patch',
                          url: `/options/${row.optionId}/status`,
                          body: { availability: e.target.value },
                        })
                      }
                    >
                      <option value="Available">Đang bán</option>
                      <option value="OutOfStock">Hết hàng</option>
                      <option value="Inactive">Ngừng bán</option>
                    </select>
                  )}
                  <button
                    className="btn-secondary"
                    disabled={mutation.isPending}
                    onClick={() => open('delete', row)}
                  >
                    {mode === 'links' ? 'Gỡ' : 'Xóa'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <MenuOptionDialog model={model} />
    </>
  )
}
