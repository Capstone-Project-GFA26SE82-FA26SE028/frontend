import { Modal } from '../../../../components/Modal/Modal'
import type { useMenuOptions } from '../hooks/useMenuOptions'
import { input, title, menuOptionError } from '../utils/menuOptions'
export function MenuOptionDialog({
  model,
}: {
  model: ReturnType<typeof useMenuOptions>
}) {
  const {
    dialog,
    mode,
    setDialog,
    mutation,
    name,
    base,
    id,
    submit,
    groups,
    source,
  } = model
  if (!dialog) return null
  return (
    <Modal
      title={dialog.action === 'delete' ? 'Xác nhận thao tác' : title[mode]}
      onClose={() => {
        if (!mutation.isPending) setDialog(undefined)
      }}
    >
      {mutation.isError && (
        <p role="alert" className="px-6 pt-4 text-rose-700">
          {menuOptionError(mutation.error)}
        </p>
      )}
      {dialog.action === 'delete' && dialog.row ? (
        <div className="space-y-4 p-6">
          <p>
            {mode === 'links' ? 'Gỡ nhóm khỏi món' : 'Xóa'}{' '}
            <strong>{name(dialog.row)}</strong>?
          </p>
          <button
            className="btn-primary"
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate({
                method: 'delete',
                url: base + '/' + id(dialog.row!),
              })
            }
          >
            Xác nhận
          </button>
        </div>
      ) : (
        <form className="space-y-4 p-6" onSubmit={submit}>
          <fieldset className="space-y-3" disabled={mutation.isPending}>
            {mode !== 'links' && (
              <label className="block">
                Tên
                <input
                  className={input}
                  name="name"
                  required
                  maxLength={255}
                  defaultValue={dialog.row ? name(dialog.row) : ''}
                />
              </label>
            )}
            {mode !== 'groups' && !dialog.row && (
              <label className="block">
                Nhóm tùy chọn
                <select name="group" className={input} required defaultValue="">
                  <option value="">Chọn nhóm</option>
                  {groups.data
                    ?.filter(
                      (group) =>
                        mode !== 'links' ||
                        !source.data?.some(
                          (row) => row.optionGroupId === group.optionGroupId,
                        ),
                    )
                    .map((group) => (
                      <option
                        key={group.optionGroupId}
                        value={group.optionGroupId}
                      >
                        {group.optionGroupName}
                      </option>
                    ))}
                </select>
              </label>
            )}
            {mode === 'options' && (
              <label className="block">
                Phụ thu (₫)
                <input
                  className={input}
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={dialog.row?.extraPrice ?? 0}
                />
              </label>
            )}
            {mode === 'links' && (
              <>
                <label className="block">
                  Chọn tối thiểu
                  <input
                    className={input}
                    type="number"
                    name="min"
                    min="0"
                    step="1"
                    required
                    defaultValue={dialog.row?.minSelection ?? 0}
                  />
                </label>
                <label className="block">
                  Chọn tối đa
                  <input
                    className={input}
                    type="number"
                    name="max"
                    min="0"
                    step="1"
                    required
                    defaultValue={dialog.row?.maxSelection ?? 1}
                  />
                </label>
              </>
            )}
            <button className="btn-primary">
              {mutation.isPending ? 'Đang lưu…' : 'Lưu'}
            </button>
          </fieldset>
        </form>
      )}
    </Modal>
  )
}
