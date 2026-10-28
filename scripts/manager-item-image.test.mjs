import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createServer } from 'vite'
import { validateItemImage, maxItemImageBytes } from '../src/features/manager/menu-management/utils/itemImage.ts'

let postHandler
globalThis.__itemImageTestClient = { post: (...args) => postHandler(...args) }
const require = createRequire(import.meta.url)
const source = (await readFile(new URL('../src/features/manager/menu-management/api/catalogApi.ts', import.meta.url), 'utf8'))
  .replace("import axios from 'axios'", `import axios from ${JSON.stringify(pathToFileURL(require.resolve('axios')).href)}`)
  .replace("import { z } from 'zod'", `import zod from ${JSON.stringify(pathToFileURL(require.resolve('zod')).href)}; const { z } = zod`)
  .replace("import { axiosClient } from '../../../../api/axiosClient'", 'const axiosClient = globalThis.__itemImageTestClient')
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext } }).outputText
const { uploadItemImage } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
delete globalThis.__itemImageTestClient

test('image selection accepts supported formats and rejects invalid or oversized files', () => {
  for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
    assert.equal(validateItemImage({ type, size: maxItemImageBytes }), null)
  }
  assert.match(validateItemImage({ type: 'image/svg+xml', size: 20 }), /JPEG/)
  assert.match(validateItemImage({ type: 'image/png', size: 0 }), /2 MB/)
  assert.match(validateItemImage({ type: 'image/png', size: maxItemImageBytes + 1 }), /2 MB/)
})

test('uploads multipart file through the authenticated gateway and returns its image URL', async () => {
  const file = new File(['image bytes'], 'dish.png', { type: 'image/png' })
  const signal = new AbortController().signal
  const url = 'https://res.cloudinary.com/test/image/upload/dish.png'
  postHandler = async (path, body, config) => {
    assert.equal(path, '/items/images')
    assert.ok(body instanceof FormData)
    assert.equal(body.get('file').name, 'dish.png')
    assert.equal(await body.get('file').text(), 'image bytes')
    assert.equal(config.signal, signal)
    assert.equal(config.headers, undefined, 'the browser supplies the multipart boundary')
    return { data: { isSuccess: true, result: { imageUrl: url } } }
  }
  assert.equal(await uploadItemImage(file, signal), url)
})

test('upload failures and malformed responses cannot produce a saved image URL', async () => {
  const file = new File(['image'], 'dish.png', { type: 'image/png' })
  postHandler = async () => ({ data: { isSuccess: false, message: 'Cloudinary unavailable' } })
  await assert.rejects(uploadItemImage(file), /Cloudinary unavailable/)
  postHandler = async () => ({ data: { isSuccess: true, result: {} } })
  await assert.rejects(uploadItemImage(file))
})

test('create and edit forms offer image selection and preserve existing previews', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  try {
    client.setQueryData(['manager-catalog', 'category-choices'], [{ categoryId: 'food', categoryName: 'Food', isActive: true }])
    const { ItemFormModal } = await server.ssrLoadModule('/src/features/manager/menu-management/components/ItemFormModal.tsx')
    const render = (item) => renderToString(React.createElement(QueryClientProvider, { client }, React.createElement(ItemFormModal, { item, onClose() {} })))
    const create = render()
    assert.ok(create.includes('type="file"'))
    assert.ok(create.includes('image/jpeg,image/png,image/webp'))
    assert.ok(!create.includes('type="url"'))
    const edit = render({ itemId: 'dish', itemName: 'Soup', categoryId: 'food', imageUrl: 'https://res.cloudinary.com/test/image/upload/soup.png', version: 'v1' })
    assert.ok(edit.includes('https://res.cloudinary.com/test/image/upload/soup.png'))
    assert.ok(edit.includes('Remove image'))
    const { FormActions } = await server.ssrLoadModule('/src/features/manager/menu-management/components/FormActions.tsx')
    const blocked = renderToString(React.createElement(FormActions, { pending: false, submitDisabled: true, close() {} }))
    assert.match(blocked, /type="submit" disabled=""/)
    assert.doesNotMatch(blocked, /type="button" disabled=""/)
  } finally {
    client.clear()
    await server.close()
  }
})
