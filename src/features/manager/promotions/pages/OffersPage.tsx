import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal } from '../../../../components/Modal/Modal'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import {
  Pagination,
  PAGE_SIZE,
} from '../../../../components/Pagination/Pagination'
import { Panel } from '../../../../components/Panel/Panel'
import { useAppSelector } from '../../../../app/hooks'
import { useDebounce } from '../../../../hooks/useDebounce'
import {
  getOffer,
  listOffers,
  offerError,
  offerId,
  offerName,
  writeOffer,
  type Kind,
  type Offer,
} from '../api/offers'
import { OfferForm } from '../components/OfferForm'

const date = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : 'Không giới hạn'
const vn = new Intl.NumberFormat('vi-VN')
export function OffersPage({ kind }: { kind: Kind }) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const scope = user?.userId + ':' + user?.restaurantId
  return <OffersWorkspace key={scope + kind} scope={scope} kind={kind} />
}
function OffersWorkspace({ kind, scope }: { kind: Kind; scope: string }) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [dialog, setDialog] = useState<{
    mode: 'create' | 'view' | 'edit' | 'status'
    row?: Offer
  }>()
  const [notice, setNotice] = useState('')
  const client = useQueryClient()
  const query = useDebounce(search, 300)
  const key = ['manager-offers', scope, kind]
  const list = useQuery({
    queryKey: [...key, page, query, status],
    queryFn: ({ signal }) =>
      listOffers(
        kind,
        {
          page,
          pageSize: PAGE_SIZE,
          search: query.trim() || undefined,
          isActive: status === '' ? undefined : status === 'true',
        },
        signal,
      ),
  })
  const id = dialog?.row && offerId(dialog.row)
  const detail = useQuery({
    queryKey: [...key, 'detail', id],
    enabled: !!id && (dialog?.mode === 'view' || dialog?.mode === 'edit'),
    queryFn: ({ signal }) => getOffer(kind, id!, signal),
  })
  const mutation = useMutation({
    mutationFn: (body: object) =>
      writeOffer(kind, body, id, dialog?.mode === 'status'),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: key })
      setDialog(undefined)
      setNotice('Đã lưu thay đổi.')
    },
  })
  function open(mode: NonNullable<typeof dialog>['mode'], row?: Offer) {
    mutation.reset()
    setNotice('')
    setDialog({ mode, row })
  }
  const title = kind === 'promotions' ? 'Khuyến mãi' : 'Voucher'
  return (
    <>
      <PageHeading
        title={title}
        eyebrow="Ưu đãi"
        description={
          kind === 'promotions'
            ? 'Quản lý chương trình giảm giá của nhà hàng.'
            : 'Phát hành mã giảm giá và quản lý giới hạn sử dụng.'
        }
        action={
          <button className="btn-primary" onClick={() => open('create')}>
            Tạo {title.toLowerCase()}
          </button>
        }
      />
      <nav aria-label="Ưu đãi" className="mb-5 flex gap-3">
        <Link
          className={kind === 'promotions' ? 'btn-primary' : 'btn-secondary'}
          to="/manager/promotions"
        >
          Khuyến mãi
        </Link>
        <Link
          className={kind === 'vouchers' ? 'btn-primary' : 'btn-secondary'}
          to="/manager/vouchers"
        >
          Voucher
        </Link>
      </nav>
      <Panel>
        <div className="flex flex-wrap gap-3 p-4">
          <input
            aria-label="Tìm ưu đãi"
            placeholder="Tìm theo tên hoặc mã…"
            value={search}
            className="min-h-11 rounded-xl border px-3"
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
          <select
            aria-label="Trạng thái"
            value={status}
            className="min-h-11 rounded-xl border px-3"
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Mọi trạng thái</option>
            <option value="true">Đã bật</option>
            <option value="false">Đã tắt</option>
          </select>
          <button
            className="btn-secondary"
            disabled={list.isFetching}
            onClick={() => void list.refetch()}
          >
            Làm mới
          </button>
        </div>
        {notice && (
          <p role="status" className="px-4 pb-4 text-emerald-700">
            {notice}
          </p>
        )}
        {list.isPending && (
          <p role="status" className="p-4">
            Đang tải…
          </p>
        )}
        {list.isError && (
          <p role="alert" className="p-4 text-rose-700">
            {offerError(list.error)}
          </p>
        )}
        {list.data && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm [&_td]:p-4 [&_th]:p-4">
                <thead className="bg-slate-50">
                  <tr>
                    <th>Tên / mã</th>
                    <th>Giảm giá</th>
                    <th>Đã dùng</th>
                    <th>Hiệu lực</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {list.data.items.map((row) => (
                    <tr
                      className="border-t border-slate-100"
                      key={offerId(row)}
                    >
                      <td className="font-semibold">{offerName(row)}</td>
                      <td>
                        {vn.format(row.discountValue)}
                        {row.discountType === 'Percentage' ? '%' : ' ₫'}
                      </td>
                      <td>
                        {row.currentUsage} / {row.usageLimit ?? '∞'}
                      </td>
                      <td>
                        {date(row.startAt)}
                        <br />
                        {date(row.endAt)}
                      </td>
                      <td>{row.isActive ? 'Đã bật' : 'Đã tắt'}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="btn-secondary"
                            onClick={() => open('view', row)}
                          >
                            Chi tiết
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => open('edit', row)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => open('status', row)}
                          >
                            {row.isActive ? 'Tắt' : 'Bật'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!list.data.items.length && (
              <p className="p-6 text-center text-slate-500">
                Không có ưu đãi phù hợp.
              </p>
            )}
            <Pagination
              total={list.data.totalCount}
              page={page}
              onPage={setPage}
            />
          </>
        )}
      </Panel>
      {dialog && (
        <Modal
          size="wide"
          title={
            dialog.mode === 'create'
              ? 'Tạo ' + title.toLowerCase()
              : offerName(dialog.row!) || title
          }
          onClose={() => {
            if (!mutation.isPending) setDialog(undefined)
          }}
        >
          {mutation.isError && (
            <p role="alert" className="px-6 pt-4 text-rose-700">
              {offerError(mutation.error)}
            </p>
          )}
          {dialog.mode === 'create' && (
            <OfferForm
              kind={kind}
              scope={scope}
              pending={mutation.isPending}
              onSave={mutation.mutate}
            />
          )}
          {(dialog.mode === 'view' || dialog.mode === 'edit') && (
            <>
              {detail.isPending && (
                <p role="status" className="p-6">
                  Đang tải chi tiết…
                </p>
              )}
              {detail.isError && (
                <div role="alert" className="p-6">
                  {offerError(detail.error)}{' '}
                  <button
                    className="underline"
                    onClick={() => void detail.refetch()}
                  >
                    Tải lại
                  </button>
                </div>
              )}
              {detail.data &&
                (dialog.mode === 'edit' ? (
                  <OfferForm
                    kind={kind}
                    scope={scope}
                    offer={detail.data}
                    pending={mutation.isPending}
                    onSave={mutation.mutate}
                  />
                ) : (
                  <div className="space-y-2 p-6">
                    <p>
                      Giảm giá {vn.format(detail.data.discountValue)}
                      {detail.data.discountType === 'Percentage' ? '%' : ' ₫'}
                    </p>
                    <p>
                      Hiệu lực từ {date(detail.data.startAt)} đến{' '}
                      {date(detail.data.endAt)}
                    </p>
                    <p>
                      Đã dùng {detail.data.currentUsage} /{' '}
                      {detail.data.usageLimit ?? 'không giới hạn'} lượt
                    </p>
                    <p>{detail.data.isActive ? 'Đã bật' : 'Đã tắt'}</p>
                    {detail.data.type && (
                      <p>
                        Phạm vi{' '}
                        {detail.data.type === 'Item'
                          ? 'Theo món'
                          : detail.data.type === 'Category'
                            ? 'Theo danh mục'
                            : 'Toàn đơn'}
                      </p>
                    )}
                    {detail.data.minimumSpend != null && (
                      <p>
                        Đơn tối thiểu {vn.format(detail.data.minimumSpend)} ₫
                      </p>
                    )}
                    {detail.data.maximumDiscount != null && (
                      <p>
                        Mức giảm tối đa {vn.format(detail.data.maximumDiscount)}{' '}
                        ₫
                      </p>
                    )}
                    {!!detail.data.targets?.length && (
                      <p>{detail.data.targets.length} đối tượng áp dụng</p>
                    )}
                  </div>
                ))}
            </>
          )}
          {dialog.mode === 'status' && (
            <div className="space-y-4 p-6">
              <p>{dialog.row?.isActive ? 'Tắt' : 'Bật'} ưu đãi này?</p>
              <button
                className="btn-primary"
                disabled={mutation.isPending}
                onClick={() =>
                  mutation.mutate({ isActive: !dialog.row?.isActive })
                }
              >
                Xác nhận
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
