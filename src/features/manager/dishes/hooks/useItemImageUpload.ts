import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { catalogError, uploadItemImage } from '../api/catalogApi'
import { validateItemImage } from '../utils/itemImage'

export function useItemImageUpload(initialUrl?: string | null) {
  const [imageUrl, setImageUrl] = useState(initialUrl || null)
  const [error, setError] = useState<string | null>(null)
  const request = useRef<AbortController | null>(null)
  const upload = useMutation({
    mutationFn: ({ file, signal }: { file: File; signal: AbortSignal }) =>
      uploadItemImage(file, signal),
  })

  useEffect(() => () => request.current?.abort(), [])

  const selectFile = async (file: File) => {
    if (request.current) return
    const validationError = validateItemImage(file)
    setError(validationError)
    if (validationError) return

    const controller = new AbortController()
    request.current = controller
    try {
      const url = await upload.mutateAsync({ file, signal: controller.signal })
      if (!controller.signal.aborted) setImageUrl(url)
    } catch (cause) {
      if (!controller.signal.aborted) setError(catalogError(cause))
    } finally {
      request.current = null
    }
  }

  const removeImage = () => {
    if (request.current) return
    setImageUrl(null)
    setError(null)
    upload.reset()
  }

  return {
    imageUrl,
    error,
    isPending: upload.isPending,
    selectFile,
    removeImage,
  }
}
