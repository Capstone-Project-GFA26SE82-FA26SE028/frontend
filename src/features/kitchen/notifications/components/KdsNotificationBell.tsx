import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { useAppSelector } from '../../../../app/hooks'
import { useKdsNotifications } from '../hooks/useKdsNotifications'
import { KdsNotificationsPage } from '../pages/KdsNotificationsPage'
import { notificationError, unreadLabel } from '../utils/notification'

export function KdsNotificationBell() {
  const user = useAppSelector((s) => s.auth.session?.user)
  return <NotificationBell key={`${user?.userId}:${user?.restaurantId}`} />
}

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const model = useKdsNotifications(open)
  const count = model.unread.data?.count || 0
  return (
    <>
      <button
        type="button"
        aria-label={`Thông báo bếp, ${count} chưa đọc`}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={
          model.unread.isError
            ? notificationError(model.unread.error)
            : 'Thông báo bếp'
        }
        onClick={() => setOpen(true)}
        className="relative flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-emerald-50"
      >
        <Icon name="bell" size={21} />
        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 top-0 rounded-full bg-rose-600 px-1.5 text-xs font-bold leading-5 text-white"
          >
            {unreadLabel(count)}
          </span>
        )}
        {model.unread.isError && (
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 size-2 rounded-full bg-amber-500"
          />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {model.unread.isError
          ? notificationError(model.unread.error)
          : `${count} thông báo chưa đọc`}
      </span>
      {open && (
        <Modal title="Thông báo bếp" size="wide" onClose={() => setOpen(false)}>
          {model.unread.isError && (
            <div role="alert" className="px-5 pt-4 text-sm text-rose-700">
              {notificationError(model.unread.error)}
              <button
                type="button"
                className="ml-3 underline"
                onClick={() => void model.unread.refetch()}
              >
                Thử lại
              </button>
            </div>
          )}
          <KdsNotificationsPage model={model} />
        </Modal>
      )}
    </>
  )
}
