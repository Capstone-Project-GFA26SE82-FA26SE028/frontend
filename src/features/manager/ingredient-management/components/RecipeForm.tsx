import { useState } from 'react'

import { Field } from '../../../../components/Field/Field'
import { FormActions } from '../../menu-management/components/FormActions'
import { localInput, toUtc } from '../../menu-management/utils/price'
import { useIngredientMutation } from '../hooks/useIngredientMutation'
import type { Ingredient, Recipe, RecipeLine, Unit } from '../types/ingredient'
import { RecipeIngredientRow } from './RecipeIngredientRow'
import { MutationError } from './MutationError'

export function RecipeForm({
  itemId,
  source,
  latestStart,
  ingredients,
  units,
  close,
}: {
  itemId: string
  source?: Recipe
  latestStart?: string
  ingredients: Ingredient[]
  units: Unit[]
  close: () => void
}) {
  const [lines, setLines] = useState<RecipeLine[]>(
    () =>
      source?.ingredients.map((line) => ({
        key: crypto.randomUUID(),
        ingredientRef: line.ingredientRef,
        unitRef: line.unitRef,
        quantity: String(line.quantity),
      })) || [
        {
          key: crypto.randomUUID(),
          ingredientRef: '',
          unitRef: '',
          quantity: '',
        },
      ],
  )
  const [media, setMedia] = useState<Recipe['media']>(
    () => source?.media.map((entry) => ({ ...entry })) || [],
  )
  const [error, setError] = useState('')
  const mutation = useIngredientMutation(close)
  const [start] = useState(() =>
    localInput(
      new Date(
        Math.max(
          Date.now(),
          latestStart ? new Date(latestStart).getTime() + 60000 : 0,
        ),
      ).toISOString(),
    ),
  )
  return (
    <form
      className="space-y-5 p-6"
      onSubmit={(event) => {
        event.preventDefault()
        if (
          !lines.length ||
          new Set(lines.map((line) => line.ingredientRef)).size !== lines.length
        ) {
          setError(
            'Add at least one ingredient and use each ingredient only once.',
          )
          return
        }
        if (
          lines.some(
            (line) =>
              !line.ingredientRef ||
              !line.unitRef ||
              Number(line.quantity) <= 0,
          )
        ) {
          setError(
            'Each ingredient requires a valid unit and a positive quantity.',
          )
          return
        }
        const data = new FormData(event.currentTarget)
        const effectiveFrom = toUtc(String(data.get('effectiveFrom')))
        if (
          latestStart &&
          new Date(effectiveFrom).getTime() <= new Date(latestStart).getTime()
        ) {
          setError(
            'The new version must start after the latest scheduled recipe version.',
          )
          return
        }
        setError('')
        mutation.mutate({
          method: 'post',
          path: `/items/${itemId}/recipes`,
          body: {
            effectiveFrom,
            instructions: String(data.get('instructions')).trim(),
            ingredients: lines.map((line) => ({
              ingredientRef: line.ingredientRef,
              unitRef: line.unitRef,
              quantity: Number(line.quantity),
            })),
            media,
          },
        })
      }}
    >
      <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
        Số lượng tính cho một phần ăn. Khi lưu sẽ tạo phiên bản mới và giữ lịch
        sử sử dụng nguyên liệu. Hệ số quy đổi được máy chủ kiểm tra và lưu lại.
      </p>
      <Field label="Có hiệu lực từ (UTC+7) *">
        <input
          name="effectiveFrom"
          type="datetime-local"
          required
          defaultValue={start}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </Field>
      {lines.map((line, index) => (
        <RecipeIngredientRow
          key={line.key}
          line={line}
          index={index}
          ingredients={ingredients}
          units={units}
          update={(value) =>
            setLines((rows) =>
              rows.map((row) => (row.key === line.key ? value : row)),
            )
          }
          remove={() =>
            setLines((rows) => rows.filter((row) => row.key !== line.key))
          }
        />
      ))}
      <button
        type="button"
        disabled={lines.length >= 100}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        onClick={() =>
          setLines((rows) => [
            ...rows,
            {
              key: crypto.randomUUID(),
              ingredientRef: '',
              unitRef: '',
              quantity: '',
            },
          ])
        }
      >
        Thêm nguyên liệu
      </button>
      <Field label="Hướng dẫn chế biến">
        <textarea
          name="instructions"
          rows={4}
          defaultValue={source?.instructions || ''}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </Field>
      <div className="space-y-3">
        <h3 className="font-semibold">Tài liệu chế biến</h3>
        {media.map((entry, index) => (
          <div key={index} className="flex flex-wrap gap-2">
            <select
              aria-label={`Loại tài liệu ${index + 1}`}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-32"
              value={entry.mediaType}
              onChange={(event) =>
                setMedia((rows) =>
                  rows.map((row, i) =>
                    i === index
                      ? { ...row, mediaType: event.target.value }
                      : row,
                  ),
                )
              }
            >
              <option value="image">Hình ảnh</option>
              <option value="video">Video</option>
              {!['image', 'video'].includes(entry.mediaType) && (
                <option value={entry.mediaType}>{entry.mediaType}</option>
              )}
            </select>
            <input
              aria-label={`Đường dẫn tài liệu ${index + 1}`}
              required
              type="url"
              maxLength={2048}
              placeholder="https://…"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 min-w-0 flex-1"
              value={entry.url}
              onChange={(event) =>
                setMedia((rows) =>
                  rows.map((row, i) =>
                    i === index ? { ...row, url: event.target.value } : row,
                  ),
                )
              }
            />
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              onClick={() =>
                setMedia((rows) => rows.filter((_, i) => i !== index))
              }
            >
              Xóa
            </button>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          onClick={() =>
            setMedia((rows) => [
              ...rows,
              {
                mediaType: 'image',
                url: '',
                displayOrder:
                  Math.max(-1, ...rows.map((row) => row.displayOrder)) + 1,
              },
            ])
          }
        >
          Thêm tài liệu
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
      <MutationError error={mutation.error} />
      <FormActions
        pending={mutation.isPending || !lines.length}
        close={close}
      />
    </form>
  )
}
