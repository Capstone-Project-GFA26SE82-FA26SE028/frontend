export const itemImageAccept = 'image/jpeg,image/png,image/webp'
export const maxItemImageBytes = 2 * 1024 * 1024

export function validateItemImage(file: Pick<File, 'type' | 'size'>) {
  if (!itemImageAccept.split(',').includes(file.type)) {
    return 'Choose a JPEG, PNG or WebP image.'
  }
  if (file.size === 0 || file.size > maxItemImageBytes) {
    return 'Choose an image between 1 byte and 2 MB.'
  }
  return null
}
