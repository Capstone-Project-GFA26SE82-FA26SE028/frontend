import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Link } from 'react-router-dom'
import type { RestaurantTable } from '../../tables/schema'
import {
  Panel,
  Badge,
  secondaryButton,
  primaryButton,
} from '../../components/AdminUI'
export function TableQrCard({
  table,
  area,
  eligible,
  onGenerate,
}: {
  table: RestaurantTable
  area: string
  eligible: boolean
  onGenerate: () => void
}) {
  const [image, setImage] = useState('')
  const [message, setMessage] = useState('')
  const path = table.token ? '/table-access/' + table.token : ''
  const url = path ? window.location.origin + path : ''
  useEffect(() => {
    let active = true
    if (url)
      QRCode.toDataURL(url, {
        width: 512,
        margin: 4,
        errorCorrectionLevel: 'M',
        color: { dark: '#064e3b', light: '#ffffff' },
      })
        .then((data) => {
          if (active) {
            setImage(data)
            setMessage('')
          }
        })
        .catch(() => {
          if (active) setMessage('Không tạo được ảnh QR.')
        })
    return () => {
      active = false
    }
  }, [url])
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{table.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {area} · {table.capacity} khách
          </p>
        </div>
        <Badge tone={eligible ? 'green' : 'slate'}>
          {eligible ? 'Sẵn sàng' : 'Chưa đủ điều kiện'}
        </Badge>
      </div>
      <div className="my-5 flex min-h-48 items-center justify-center rounded-2xl bg-slate-50">
        {url && image ? (
          <img src={image} alt={'Mã QR ' + table.name} className="size-48" />
        ) : (
          <p className="p-5 text-sm text-slate-400">Chưa có mã QR</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          disabled={!eligible}
          className={primaryButton}
          onClick={onGenerate}
        >
          {table.token ? 'Tạo lại mã' : 'Tạo mã QR'}
        </button>
        {url && image && (
          <>
            <a
              className={secondaryButton}
              href={image}
              download={'QR-' + table.code + '.png'}
            >
              Tải PNG
            </a>
            <Link className={secondaryButton} to={path}>
              Xem trước
            </Link>
            <button
              className={secondaryButton}
              onClick={() =>
                navigator.clipboard
                  .writeText(url)
                  .then(() => setMessage('Đã sao chép liên kết.'))
                  .catch(() =>
                    setMessage('Không thể sao chép. Hãy dùng nút Xem trước.'),
                  )
              }
            >
              Sao chép
            </button>
          </>
        )}
      </div>
      {message && (
        <p role="status" className="mt-3 text-sm text-slate-600">
          {message}
        </p>
      )}
    </Panel>
  )
}
