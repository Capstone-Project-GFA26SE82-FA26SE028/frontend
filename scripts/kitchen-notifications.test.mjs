import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'

test('KDS notifications validate and use the personal backend API', async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  })
  try {
    const { notificationApi } = await server.ssrLoadModule(
      '/src/features/kitchen/notifications/api/notificationApi.ts',
    )
    const { notificationSchema } = await server.ssrLoadModule(
      '/src/features/kitchen/notifications/schemas/notificationSchema.ts',
    )
    const { unreadLabel, notificationError, notificationAccessDenied } =
      await server.ssrLoadModule(
        '/src/features/kitchen/notifications/utils/notification.ts',
      )
    const { axiosClient } = await server.ssrLoadModule(
      '/src/api/axiosClient.ts',
    )
    const item = {
      id: '11111111-1111-4111-8111-111111111111',
      restaurantId: '22222222-2222-4222-8222-222222222222',
      type: 'KitchenOrderAccepted',
      title: 'Có món cần chế biến',
      message: 'Món đã chuyển bếp.',
      entityType: 'Order',
      entityId: '33333333-3333-4333-8333-333333333333',
      createdAt: '2026-11-26T01:00:00Z',
      readAt: null,
    }
    const calls = []
    let payload
    axiosClient.defaults.adapter = async (config) => {
      calls.push(config)
      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: {},
        data: payload,
      }
    }
    const ok = (result) => ({ isSuccess: true, result })
    const signal = new AbortController().signal
    payload = ok({ items: [item], totalCount: 21, page: 2, pageSize: 20 })
    const page = await notificationApi.list(
      { page: 2, type: 'KitchenOrderAccepted', unreadOnly: true },
      signal,
    )
    assert.equal(page.items[0].readAt, null)
    assert.equal(page.totalCount, 21)
    assert.equal(calls[0].url, '/notifications')
    assert.equal(calls[0].signal, signal)
    assert.deepEqual(calls[0].params, {
      page: 2,
      pageSize: 20,
      type: 'KitchenOrderAccepted',
      isRead: false,
    })
    await notificationApi.list({ page: 1, type: '', unreadOnly: false })
    assert.equal(calls[1].params.isRead, undefined)
    assert.equal(calls[1].params.type, undefined)
    assert.ok(
      calls.every(
        (c) => !c.url.includes('/restaurants/') && !c.params?.restaurantId,
      ),
    )
    payload = ok({ count: 7 })
    assert.equal((await notificationApi.unread(signal)).count, 7)
    assert.equal(calls.at(-1).url, '/notifications/unread-count')
    payload = ok({ notification: item, recipients: [] })
    assert.equal(
      (await notificationApi.detail(item.id, signal)).notification.id,
      item.id,
    )
    assert.equal(calls.at(-1).url, `/notifications/${item.id}`)
    payload = ok(null)
    await notificationApi.markRead(item.id)
    assert.equal(calls.at(-1).method, 'patch')
    assert.equal(calls.at(-1).url, `/notifications/${item.id}/read`)
    await notificationApi.markRead()
    assert.equal(calls.at(-1).url, '/notifications/read-all')
    payload = { isSuccess: false, message: 'Access denied', result: null }
    await assert.rejects(notificationApi.markRead(), /Access denied/)
    payload = ok({ count: -1 })
    await assert.rejects(notificationApi.unread())
    assert.equal(
      notificationSchema.safeParse({ ...item, createdAt: 'invalid' }).success,
      false,
    )
    assert.equal(
      notificationSchema.safeParse({ ...item, readAt: '2026-11-26T02:00:00Z' })
        .success,
      true,
    )
    assert.equal(unreadLabel(100), '99+')
    assert.equal(unreadLabel(0), '0')
    const denied = { isAxiosError: true, response: { status: 403 } }
    assert.equal(notificationAccessDenied(denied), true)
    assert.match(notificationError(denied), /không có quyền/)
    assert.equal(notificationAccessDenied(new Error('Offline')), false)
    const { NotificationCard } = await server.ssrLoadModule(
      '/src/features/kitchen/notifications/components/NotificationCard.tsx',
    )
    const card = (value) =>
      renderToString(
        React.createElement(NotificationCard, {
          item: value,
          selected: false,
          onSelect() {},
        }),
      )
    assert.ok(card(item).includes('Chưa đọc'))
    assert.ok(!card({ ...item, readAt: item.createdAt }).includes('Chưa đọc'))
    assert.ok(
      card({ ...item, message: '<script>alert(1)</script>' }).includes(
        '&lt;script&gt;',
      ),
    )
    const { KdsNotificationsPage } = await server.ssrLoadModule(
      '/src/features/kitchen/notifications/pages/KdsNotificationsPage.tsx',
    )
    const model = {
      list: { isSuccess: true, data: { items: [], totalCount: 0 } },
      unread: { data: { count: 0 } },
      detail: {},
      markRead: {},
      page: 1,
      type: '',
      unreadOnly: false,
    }
    const empty = renderToString(
      React.createElement(KdsNotificationsPage, { model }),
    )
    assert.ok(empty.includes('Không có thông báo phù hợp.'))
    assert.ok(empty.includes('Phân trang thông báo'))
    const failed = renderToString(
      React.createElement(KdsNotificationsPage, {
        model: {
          ...model,
          list: { isError: true, error: new Error('Server unavailable') },
        },
      }),
    )
    assert.ok(failed.includes('role="alert"'))
    assert.ok(failed.includes('Server unavailable'))
  } finally {
    await server.close()
  }
})
