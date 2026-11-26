import { useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  offerError,
  offerName,
  targetChoices,
  type Kind,
  type Offer,
} from '../api/offers'

const input = 'block min-h-11 w-full rounded-xl border border-slate-200 px-3'
function localTime(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}
export function OfferForm({
  kind,
  offer,
  pending,
  onSave,
  scope,
}: {
  kind: Kind
  offer?: Offer
  pending: boolean
  onSave: (body: object) => void
  scope?: string
}) {
  const promotion = kind === 'promotions'
  const [type, setType] = useState(offer?.type || 'Order')
  const [error, setError] = useState('')
  const needsTargets = promotion && !offer && type !== 'Order'
  const choices = useQuery({
    queryKey: ['manager-offer-targets', scope, type],
    enabled: needsTargets,
    queryFn: ({ signal }) =>
      targetChoices(type === 'Item' ? '/items' : '/categories', signal),
  })
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const fields = new FormData(event.currentTarget)
    const read = (name: string) => String(fields.get(name) || '').trim()
    const number = (name: string) =>
      read(name) ? Number(read(name)) : undefined
    const discountType = read('discountType')
    const discountValue = Number(read('discountValue'))
    const startAt = new Date(read('startAt')).toISOString()
    const endAt = read('endAt')
      ? new Date(read('endAt')).toISOString()
      : undefined
    const targets = fields.getAll('target').map((id) => ({
      [type === 'Item' ? 'itemRef' : 'categoryRef']: id,
      role: 'Target',
      requiredQuantity: 1,
    }))
    if (discountType === 'Percentage' && discountValue > 100)
      return setError('Phần trăm giảm giá tối đa là 100%.')
    if (endAt && endAt < startAt)
      return setError(
        'Thời gian kết thúc phải sau hoặc bằng thời gian bắt đầu.',
      )
    if (needsTargets && !targets.length)
      return setError('Chọn ít nhất một đối tượng áp dụng.')
    onSave({
      discountType,
      discountValue,
      startAt,
      endAt,
      usageLimit: number('usageLimit'),
      isActive: fields.has('isActive'),
      ...(promotion
        ? {
            promotionName: read('name'),
            minimumSpend: number('threshold'),
            ...(!offer ? { type, targets } : {}),
          }
        : {
            maximumDiscount: number('threshold'),
            ...(!offer ? { voucherCode: read('name') } : {}),
          }),
    })
  }
  return (
    <form onSubmit={submit} className="space-y-4 p-6">
      <fieldset disabled={pending} className="grid gap-4 sm:grid-cols-2">
        <label>
          {promotion ? 'Tên khuyến mãi' : 'Mã voucher'}
          <input
            className={input}
            name="name"
            defaultValue={offer && offerName(offer)}
            readOnly={!promotion && !!offer}
            required
            maxLength={promotion ? 255 : 50}
          />
        </label>
        <label>
          Kiểu giảm
          <select
            className={input}
            name="discountType"
            defaultValue={offer?.discountType || 'Percentage'}
          >
            <option value="Percentage">Phần trăm</option>
            <option value="FixedAmount">Số tiền cố định</option>
          </select>
        </label>
        <label>
          Giá trị giảm
          <input
            className={input}
            type="number"
            name="discountValue"
            min="0.01"
            step="0.01"
            defaultValue={offer?.discountValue}
            required
          />
        </label>
        <label>
          Giới hạn lượt dùng
          <input
            className={input}
            type="number"
            name="usageLimit"
            min="1"
            step="1"
            defaultValue={offer?.usageLimit ?? ''}
            required={offer?.usageLimit != null}
          />
        </label>
        <label>
          {promotion ? 'Đơn tối thiểu' : 'Mức giảm tối đa'}
          <input
            className={input}
            type="number"
            name="threshold"
            min={promotion ? 0 : 0.01}
            step="0.01"
            defaultValue={
              (promotion ? offer?.minimumSpend : offer?.maximumDiscount) ?? ''
            }
            required={
              (promotion ? offer?.minimumSpend : offer?.maximumDiscount) != null
            }
          />
        </label>
        {promotion && (
          <label>
            Phạm vi
            <select
              className={input}
              value={type}
              disabled={!!offer}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="Order">Toàn đơn</option>
              <option value="Item">Theo món</option>
              <option value="Category">Theo danh mục</option>
            </select>
          </label>
        )}
        {needsTargets && (
          <label className="sm:col-span-2">
            {type === 'Item' ? 'Món áp dụng' : 'Danh mục áp dụng'}
            <select
              key={type}
              multiple
              name="target"
              className={input + ' min-h-32'}
              required
            >
              {choices.data?.map((choice) => (
                <option key={choice.id} value={choice.id}>
                  {choice.name}
                </option>
              ))}
            </select>
            <span className="text-sm text-slate-500">
              Giữ Ctrl hoặc Command để chọn nhiều mục.
            </span>
          </label>
        )}
        <label>
          Bắt đầu
          <input
            className={input}
            type="datetime-local"
            name="startAt"
            defaultValue={localTime(offer?.startAt || new Date().toISOString())}
            required
          />
        </label>
        <label>
          Kết thúc
          <input
            className={input}
            type="datetime-local"
            name="endAt"
            defaultValue={localTime(offer?.endAt)}
            required={!!offer?.endAt}
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={offer?.isActive ?? true}
          />{' '}
          Kích hoạt
        </label>
      </fieldset>
      {offer && (
        <p className="text-sm text-slate-500">
          API giữ nguyên{' '}
          {promotion ? 'phạm vi và đối tượng áp dụng' : 'mã voucher'} khi chỉnh
          sửa. Các giới hạn và ngày kết thúc đã lưu không thể để trống.
        </p>
      )}
      {needsTargets && choices.isPending && (
        <p role="status">Đang tải đối tượng áp dụng…</p>
      )}
      {needsTargets && choices.isError && (
        <p role="alert">
          {offerError(choices.error)}{' '}
          <button
            type="button"
            className="underline"
            onClick={() => void choices.refetch()}
          >
            Tải lại
          </button>
        </p>
      )}
      {error && (
        <p role="alert" className="text-rose-700">
          {error}
        </p>
      )}
      <button
        disabled={pending || (needsTargets && !choices.data?.length)}
        className="btn-primary"
      >
        {pending ? 'Đang lưu…' : 'Lưu'}
      </button>
    </form>
  )
}
