import { useState } from 'react'
import {
  Field,
  fieldClass,
  secondaryButton,
} from '../../../admin/components/AdminUI'
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
        Quantities are for one portion. Saving creates a new version and
        preserves historical ingredient usage. Conversion factors are verified
        and stored by the server.
      </p>
      <Field label="Effective from (UTC+7) *">
        <input
          name="effectiveFrom"
          type="datetime-local"
          required
          defaultValue={start}
          className={fieldClass}
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
        className={secondaryButton}
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
        Add ingredient
      </button>
      <Field label="Preparation instructions">
        <textarea
          name="instructions"
          rows={4}
          defaultValue={source?.instructions || ''}
          className={fieldClass}
        />
      </Field>
      <div className="space-y-3">
        <h3 className="font-semibold">Preparation resources</h3>
        {media.map((entry, index) => (
          <div key={index} className="flex flex-wrap gap-2">
            <select
              aria-label={`Resource ${index + 1} type`}
              className={`${fieldClass} sm:w-32`}
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
              <option value="image">Image</option>
              <option value="video">Video</option>
              {!['image', 'video'].includes(entry.mediaType) && (
                <option value={entry.mediaType}>{entry.mediaType}</option>
              )}
            </select>
            <input
              aria-label={`Resource ${index + 1} URL`}
              required
              type="url"
              maxLength={2048}
              placeholder="https://…"
              className={`${fieldClass} min-w-0 flex-1`}
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
              className={secondaryButton}
              onClick={() =>
                setMedia((rows) => rows.filter((_, i) => i !== index))
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className={secondaryButton}
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
          Add resource
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
