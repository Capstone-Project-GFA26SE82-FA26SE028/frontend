import { Modal } from '../../../../components/Modal/Modal'
import { Field, fieldClass } from '../../../admin/components/AdminUI'
import { useCatalogMutation } from '../hooks/useCatalogMutation'
import { useCategoryChoices } from '../hooks/useCategoryChoices'
import { useItemImageUpload } from '../hooks/useItemImageUpload'
import type { Item } from '../types/catalog'
import { FormActions } from './FormActions'
import { ItemImagePicker } from './ItemImagePicker'
import { QueryState } from './QueryState'

export function ItemFormModal({
  item,
  onClose,
}: {
  item?: Item
  onClose: () => void
}) {
  const categories = useCategoryChoices()
  const mutation = useCatalogMutation(onClose)
  const image = useItemImageUpload(item?.imageUrl)
  const pending = mutation.isPending || image.isPending

  return (
    <Modal
      closeLabel="Close"
      title={item ? 'Edit menu item' : 'Add menu item'}
      onClose={() => {
        if (!pending) onClose()
      }}
    >
      <form
        className="space-y-4 p-6"
        onSubmit={(event) => {
          event.preventDefault()
          if (pending || image.error || !categories.data) return
          const data = new FormData(event.currentTarget)
          mutation.mutate({
            method: item ? 'put' : 'post',
            path: item ? `/items/${item.itemId}` : '/items',
            body: {
              itemName: String(data.get('name')).trim(),
              categoryId: data.get('category'),
              description: String(data.get('description')).trim() || null,
              imageUrl: image.imageUrl,
              ...(item ? { version: item.version } : {}),
            },
          })
        }}
      >
        <fieldset className="min-w-0 space-y-4" disabled={mutation.isPending}>
          <Field label="Item name *">
            <input
              name="name"
              required
              autoFocus
              maxLength={255}
              defaultValue={item?.itemName}
              className={fieldClass}
            />
          </Field>
          <QueryState
            pending={categories.isPending}
            error={categories.error}
            retry={() => void categories.refetch()}
          >
            <Field label="Category *">
              <select
                name="category"
                required
                defaultValue={item?.categoryId || ''}
                className={fieldClass}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.data
                  ?.filter(
                    (category) =>
                      category.isActive ||
                      category.categoryId === item?.categoryId,
                  )
                  .map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                      {!category.isActive ? ' (inactive)' : ''}
                    </option>
                  ))}
              </select>
            </Field>
          </QueryState>
          <Field label="Description">
            <textarea
              name="description"
              maxLength={2000}
              rows={3}
              defaultValue={item?.description || ''}
              className={fieldClass}
            />
          </Field>
          <ItemImagePicker
            imageUrl={image.imageUrl}
            error={image.error}
            pending={pending}
            onSelect={(file) => void image.selectFile(file)}
            onRemove={image.removeImage}
          />
        </fieldset>
        {!item && (
          <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">
            New items are created as inactive. A valid standard price and an
            effective recipe are required before making an item available.
          </p>
        )}
        <FormActions
          pending={pending}
          submitDisabled={!categories.data || !!image.error}
          close={onClose}
        />
      </form>
    </Modal>
  )
}
