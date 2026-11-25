import { useState } from 'react'
import { Field } from '../../../../components/Field/Field'
import { stationWriteSchema } from '../schemas/kitchenStationSchema'
import {
  buttonClass,
  inputClass,
  primaryClass,
} from '../constants/kitchenStation'
import type { KitchenStation, StationWrite } from '../types/kitchenStation'
export function StationForm({
  station,
  pending,
  onSave,
  onClose,
}: {
  station?: KitchenStation
  pending: boolean
  onSave: (body: StationWrite) => void
  onClose: () => void
}) {
  const [error, setError] = useState('')
  return (
    <form
      className="space-y-5 p-6"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const parsed = stationWriteSchema.safeParse({
          kitchenStationCode: data.get('code'),
          kitchenStationName: data.get('name'),
        })
        if (!parsed.success) {
          setError(parsed.error.issues[0].message)
          return
        }
        setError('')
        onSave(parsed.data)
      }}
    >
      <Field label="Mã trạm *">
        <input
          autoFocus
          name="code"
          required
          maxLength={50}
          defaultValue={station?.kitchenStationCode}
          className={inputClass}
          placeholder="HOT, BAR…"
        />
      </Field>
      <Field label="Tên trạm *">
        <input
          name="name"
          required
          maxLength={255}
          defaultValue={station?.kitchenStationName}
          className={inputClass}
        />
      </Field>
      {error && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          disabled={pending}
          className={buttonClass}
          onClick={onClose}
        >
          Hủy
        </button>
        <button disabled={pending} className={primaryClass}>
          {pending ? 'Đang lưu…' : 'Lưu'}
        </button>
      </div>
    </form>
  )
}
