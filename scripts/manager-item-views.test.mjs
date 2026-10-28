import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import { useItemViewMode } from '../src/features/manager/menu-management/hooks/useItemViewMode.ts'

test('both menu views preserve item data and all item actions', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  try {
    const items = [
      { itemId: 'soup', itemName: 'Soup', itemCode: 'SOUP-01', categoryName: 'Food', availability: 'Available', imageUrl: 'https://res.cloudinary.com/demo/image/upload/soup.jpg', description: 'Vegetable soup' },
      { itemId: 'tea', itemName: 'Iced tea', itemCode: 'TEA-01', categoryName: 'Drinks', availability: 'OutOfStock', imageUrl: null },
    ]
    for (const name of ['ItemCardGrid', 'ItemList']) {
      const module = await server.ssrLoadModule(`/src/features/manager/menu-management/components/${name}.tsx`)
      const html = renderToString(React.createElement(MemoryRouter, null, React.createElement(module[name], { items, onEdit() {}, onStatus() {} })))
      for (const item of items) {
        assert.ok(html.includes(item.itemName))
        assert.ok(html.includes(item.itemCode))
        assert.ok(html.includes(`/manager/menu/prices?itemId=${item.itemId}`))
        assert.ok(html.includes(`/manager/recipes?itemId=${item.itemId}`))
        assert.ok(html.includes(`Edit ${item.itemName}`))
        assert.ok(html.includes(`Update availability for ${item.itemName}`))
      }
      assert.ok(html.includes('soup.jpg'))
      assert.ok(html.includes('Out of stock'))
      assert.equal(html.includes('<table'), name === 'ItemList')
    }
    const { ItemViewToggle } = await server.ssrLoadModule('/src/features/manager/menu-management/components/ItemViewToggle.tsx')
    for (const mode of ['card', 'list']) {
      const html = renderToString(React.createElement(ItemViewToggle, { view: mode, onChange() {} }))
      assert.ok(html.includes('aria-label="Menu item view"'))
      assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1)
      assert.ok(html.includes('Card'))
      assert.ok(html.includes('List'))
    }
  } finally {
    await server.close()
  }
})

test('view preference restores Card and falls back to List when storage is unavailable', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  function Probe() { return React.createElement('span', null, useItemViewMode().view) }
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => 'card' } })
    assert.equal(renderToString(React.createElement(Probe)), '<span>card</span>')
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem() { throw new Error('Storage disabled') } } })
    assert.equal(renderToString(React.createElement(Probe)), '<span>list</span>')
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original)
    else delete globalThis.localStorage
  }
})
