import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

test('kitchen assignments preserve paging, employee eligibility and concurrent write contracts', async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  })
  try {
    const { assignmentApi } = await server.ssrLoadModule(
      '/src/features/manager/kitchen-assignments/api/assignmentApi.ts',
    )
    const { axiosClient } = await server.ssrLoadModule(
      '/src/api/axiosClient.ts',
    )
    const { assignmentRows, employeeName, matchesAssignment, assignmentError } =
      await server.ssrLoadModule(
        '/src/features/manager/kitchen-assignments/utils/assignment.ts',
      )
    const { AssignmentTable } = await server.ssrLoadModule(
      '/src/features/manager/kitchen-assignments/components/AssignmentTable.tsx',
    )
    const { AssignmentForm } = await server.ssrLoadModule(
      '/src/features/manager/kitchen-assignments/components/AssignmentForm.tsx',
    )
    // Actual seed GUIDs are valid .NET IDs without RFC UUID version/variant bits.
    const stationId = '20000000-0000-0000-0000-000000000021'
    const userId = '10000000-0000-0000-0000-000000000005'
    const nextId = '33333333-3333-4333-8333-333333333333'
    const station = {
      kitchenStationId: stationId,
      kitchenStationCode: 'HOT',
      kitchenStationName: 'Bếp nóng',
      isActive: true,
    }
    const employee = {
      userId,
      userName: 'cook',
      fullName: 'Nguyễn An',
      email: 'an@example.test',
      avatarUrl: null,
      roleId: 'kitchen',
      isActive: true,
    }
    const assignment = { ...station, stationActive: true, userId, employee }
    const calls = []
    let respond = () => ({ isSuccess: true, result: assignment })
    axiosClient.defaults.adapter = async (config) => {
      calls.push(config)
      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: {},
        data: respond(config),
      }
    }
    const ok = (result) => ({ isSuccess: true, result })
    const signal = new AbortController().signal
    respond = (config) =>
      ok({
        items:
          config.params.page === 1
            ? [station]
            : [{ ...station, kitchenStationId: nextId }],
        totalCount: 2,
        page: config.params.page,
        pageSize: 100,
      })
    assert.equal((await assignmentApi.stations(signal)).length, 2)
    assert.equal(calls[1].params.page, 2)
    assert.equal(calls[0].signal, signal)
    respond = () =>
      ok({ items: [assignment], totalCount: 1, page: 1, pageSize: 100 })
    assert.equal((await assignmentApi.assignments(signal))[0].userId, userId)
    respond = () =>
      ok([
        employee,
        { ...employee, userId: nextId, isActive: false },
        { ...employee, roleId: 'waiter' },
      ])
    assert.equal((await assignmentApi.employees(signal)).length, 1)
    respond = () => ok(assignment)
    await assignmentApi.write({ kind: 'save', stationId, userId })
    assert.equal(calls.at(-1).method, 'post')
    assert.equal(calls.at(-1).url, `/kitchen-stations/${stationId}/assignment`)
    assert.deepEqual(JSON.parse(calls.at(-1).data), { userId })
    const requestCount = calls.length
    await assert.rejects(assignmentApi.write({ kind: 'save', stationId, userId: 'invalid-id' }))
    assert.equal(calls.length, requestCount, 'malformed employee IDs must not be sent to the API')
    await assignmentApi.write({
      kind: 'save',
      stationId,
      userId: nextId,
      expectedUserId: userId,
    })
    assert.equal(calls.at(-1).method, 'put')
    assert.deepEqual(JSON.parse(calls.at(-1).data), {
      userId: nextId,
      expectedUserId: userId,
    })
    respond = () => ok({ message: 'Removed' })
    await assignmentApi.write({
      kind: 'remove',
      stationId,
      expectedUserId: userId,
    })
    assert.equal(calls.at(-1).method, 'delete')
    assert.deepEqual(calls.at(-1).params, { expectedUserId: userId })
    respond = () => ({ isSuccess: false, message: 'Phân công đã thay đổi.' })
    await assert.rejects(
      assignmentApi.write({ kind: 'save', stationId, userId }),
      /Phân công đã thay đổi/,
    )
    assert.equal(
      assignmentError({
        isAxiosError: true,
        response: {
          status: 409,
          data: { message: 'Trạm còn món đang chế biến.' },
        },
      }),
      'Trạm còn món đang chế biến.',
    )
    respond = () => ok({ items: [], totalCount: 5, page: 1, pageSize: 100 })
    await assert.rejects(assignmentApi.assignments(), /Chưa tải đủ/)
    const rows = assignmentRows(
      [station, { ...station, kitchenStationId: nextId }],
      [assignment],
    )
    assert.equal(rows[0].assignment.userId, userId)
    assert.equal(rows[1].assignment, undefined)
    assert.equal(employeeName({ ...employee, fullName: '' }), 'cook')
    assert.ok(matchesAssignment('Bếp nóng Nguyễn An', 'bep nong'))
    const html = renderToString(
      React.createElement(AssignmentTable, {
        rows,
        disabled: false,
        onEdit() {},
        onRemove() {},
      }),
    )
    assert.ok(html.includes('Nguyễn An'))
    assert.ok(html.includes('Chưa phân công'))
    assert.ok(html.includes('Gỡ phân công'))
    const form = renderToString(
      React.createElement(AssignmentForm, {
        row: rows[0],
        employees: [employee],
        pending: false,
        onSave() {},
        onClose() {},
      }),
    )
    assert.ok(form.includes('Chưa có nhân viên bếp phù hợp'))
    assert.ok(
      !form.includes(`value="${userId}"`),
      'current employee is not a replacement choice',
    )
  } finally {
    await server.close()
  }
})
