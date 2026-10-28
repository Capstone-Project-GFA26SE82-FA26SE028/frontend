import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createServer } from 'vite'
import { mapKdsState } from '../src/features/kitchen/kds/utils/mapKdsState.ts'

test('Kitchen renders only the four-column KDS, including legacy tool links', async () => {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })
  try {
    const { KdsContext } = await server.ssrLoadModule(
      '/src/features/kitchen/kds/context/KdsContext.ts',
    )
    const state = mapKdsState({
      signedIn: true,
      area: 'Test kitchen',
      feedback: null,
      tasks: [
        {
          kitchenTaskId: 'task-1',
          kitchenStationId: 'station-1',
          itemId: 'dish-1',
          orderNumber: 'ORD-1',
          nameSnapshot: 'API Soup',
          quantity: 3,
          status: 'Ready',
          priority: 1,
          note: 'No salt',
          queuedAt: new Date().toISOString(),
          cookingAt: new Date().toISOString(),
          readyAt: new Date().toISOString(),
          options: [],
        },
      ],
      items: [
        { itemId: 'dish-1', itemName: 'API Soup', availability: 'Available' },
      ],
    })
    const value = {
      state,
      tickets: state.tickets,
      run: async () => true,
      pending: false,
      loading: false,
      errors: [],
      refresh() {},
      dismissFeedback() {},
      stations: [],
      stationId: '',
      setStationId() {},
    }
    const { KdsPage } = await server.ssrLoadModule(
      '/src/features/kitchen/kds/pages/KdsPage.tsx',
    )
    state.tickets.push({ ...state.tickets[0], id: 'held-dish', status: 'Hold' })
    for (const url of [
      '/kitchen',
      '/kitchen?panel=recipes',
      '/kitchen?panel=ingredients',
    ]) {
      const html = renderToString(
        React.createElement(
          MemoryRouter,
          { initialEntries: [url] },
          React.createElement(
            KdsContext.Provider,
            { value },
            React.createElement(KdsPage),
          ),
        ),
      )
      assert.ok(html.includes('API Soup'))
      assert.ok(html.includes('data-status="Hold"'))
      assert.ok(html.includes('held-dish'))
      assert.ok(!html.includes('kds-tool-panel'))
      assert.ok(!html.includes('Kitchen tools'))
      assert.ok(!html.includes('View recipe'))
      assert.ok(!html.includes('<aside'))
      assert.ok(
        html.includes('Xem công thức API Soup'),
        'dish photos expose an accessible recipe action',
      )
    }
    const { kitchenRoute } = await server.ssrLoadModule(
      '/src/routes/kitchenRoutes.tsx',
    )
    assert.equal(kitchenRoute.children.length, 2)
    assert.ok(kitchenRoute.children[0].index)
    assert.equal(kitchenRoute.children[1].path, '*')
    const { RecipeModal } = await server.ssrLoadModule(
      '/src/features/kitchen/kds/components/RecipeModal.tsx',
    )
    const store = configureStore({
      reducer: () => ({
        auth: { session: { user: { userId: 'test-kitchen' } } },
      }),
    })
    const client = new QueryClient()
    const renderRecipe = () =>
      renderToString(
        React.createElement(
          Provider,
          { store },
          React.createElement(
            QueryClientProvider,
            { client },
            React.createElement(RecipeModal, {
              dish: { id: 'dish-1', name: 'Soup', image: '/soup.png' },
              onClose() {},
            }),
          ),
        ),
      )
    assert.ok(renderRecipe().includes('Đang tải công thức'))
    client.setQueryData(['kitchen-live', 'test-kitchen', 'recipe', 'dish-1'], {
      version: 3,
      effectiveFrom: '2026-10-01',
      instructions: 'Steam for 10 minutes',
      ingredients: [],
    })
    const popup = renderRecipe()
    assert.ok(popup.includes('Steam for 10 minutes'))
    assert.ok(popup.replace(/<!--.*?-->/g, '').includes('Phiên bản 3'))
    assert.ok(popup.includes('Đóng công thức'))
    client.clear()
  } finally {
    await server.close()
  }
})
