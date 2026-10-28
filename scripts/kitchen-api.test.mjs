import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import axios from 'axios'
import { mapKdsState } from '../src/features/kitchen/kds/utils/mapKdsState.ts'
import { groupKdsOrders } from '../src/features/kitchen/kds/utils/orders.ts'

// Run the actual transport against a deterministic HTTP adapter, without a server or credentials.
let getHandler
let patchHandler
globalThis.__kitchenTestClient = {
  get: (...args) => getHandler(...args),
  patch: (...args) => patchHandler(...args),
}
const require = createRequire(import.meta.url)
const source = (
  await readFile(
    new URL('../src/features/kitchen/kds/api/kdsApi.ts', import.meta.url),
    'utf8',
  )
)
  .replace(
    "import axios from 'axios'",
    `import axios from ${JSON.stringify(pathToFileURL(require.resolve('axios')).href)}`,
  )
  .replace(
    "import { axiosClient } from '../../../../api/axiosClient'",
    'const axiosClient = globalThis.__kitchenTestClient',
  )
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.ESNext,
  },
}).outputText
const { kdsApi, kdsList, kdsError, kdsReadPolicy, kdsPollInterval } =
  await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
  )
delete globalThis.__kitchenTestClient
const ok = (result) => ({ data: { isSuccess: true, result } })

test('fetches every page and preserves all-status filter and abort signal', async () => {
  const calls = []
  const signal = new AbortController().signal
  getHandler = async (url, config) => {
    calls.push({ url, ...config })
    return ok({
      items: config.params.page === 1 ? ['pending'] : ['ready', 'served'],
      totalCount: 3,
    })
  }
  assert.deepEqual(await kdsList('/kitchen-tasks', signal, { status: 'all' }), [
    'pending',
    'ready',
    'served',
  ])
  assert.equal(calls.length, 2)
  assert.equal(calls[1].params.page, 2)
  assert.equal(calls[1].params.status, 'all')
  assert.equal(calls[1].signal, signal)
})

test('stops pagination on empty results and rejects unsuccessful envelopes', async () => {
  getHandler = async () => ok({ items: [], totalCount: 20 })
  assert.deepEqual(await kdsList('/items'), [])
  getHandler = async () => ({
    data: { isSuccess: false, message: 'Access denied' },
  })
  await assert.rejects(kdsList('/items'), /Access denied/)
})

test('loads only the clicked item active recipe and forwards cancellation', async () => {
  const signal = new AbortController().signal
  getHandler = async (url, config) => {
    assert.equal(url, '/items/dish-1/recipes/active')
    assert.equal(config.signal, signal)
    return ok({
      version: 3,
      instructions: 'Steam for 10 minutes',
      ingredients: [],
    })
  }
  assert.equal((await kdsApi.activeRecipe('dish-1', signal)).version, 3)
})

test('status writes include row version and only succeed after server acceptance', async () => {
  const calls = []
  patchHandler = async (...args) => {
    calls.push(args)
    return ok({ status: 'Cooking', version: 'next' })
  }
  assert.equal(
    (
      await kdsApi.update(
        { kitchenTaskId: 'task-1', version: 'current' },
        'status',
        'Cooking',
      )
    ).version,
    'next',
  )
  assert.deepEqual(calls[0], [
    '/kitchen-tasks/task-1/status',
    { status: 'Cooking', version: 'current' },
  ])
  patchHandler = async () => ({
    data: { isSuccess: false, message: 'Insufficient stock' },
  })
  await assert.rejects(
    kdsApi.update(
      { kitchenTaskId: 'task-1', version: 'current' },
      'status',
      'Cooking',
    ),
    /Insufficient stock/,
  )
})

test('concurrent updates and permission errors have actionable messages', () => {
  assert.match(
    kdsError(
      new axios.AxiosError('', '', undefined, undefined, { status: 409 }),
    ),
    /changed/,
  )
  assert.match(
    kdsError(
      new axios.AxiosError('', '', undefined, undefined, { status: 403 }),
    ),
    /permission/,
  )
})

test('permission failures stop automatic retries and refetches', () => {
  const error = new axios.AxiosError('', '', undefined, undefined, {
    status: 403,
  })
  const query = { state: { error } }
  assert.equal(kdsReadPolicy.retry(0, error), false)
  assert.equal(kdsReadPolicy.retryOnMount, false)
  assert.equal(kdsPollInterval(30000)(query), false)
  assert.equal(kdsReadPolicy.refetchOnWindowFocus(query), false)
  assert.equal(kdsReadPolicy.refetchOnReconnect(query), false)
  assert.equal(kdsReadPolicy.refetchOnMount(query), false)
  assert.equal(kdsPollInterval(5000)({ state: { error: null } }), 5000)
})

const task = {
  kitchenTaskId: 'task-1',
  itemId: 'dish-1',
  orderNumber: 'ORD-1',
  quantity: 3,
  kitchenStationId: 'station-1',
  nameSnapshot: 'Soup',
  originalTableId: 'table-1',
  tableSessionId: 'session-1',
  status: 'Cooking',
  priority: 1,
  queuedAt: '2026-10-29T03:00:00Z',
  cookingAt: '2026-10-29T03:05:00Z',
  note: 'No salt',
  options: [{ name: 'Extra vegetables', quantity: 2 }],
}
const input = {
  signedIn: true,
  area: 'Kitchen 1',
  tasks: [task],
  items: [],
  feedback: null,
}

test('maps API tasks into existing cards even if catalog is unavailable', () => {
  const state = mapKdsState(input)
  assert.equal(state.tickets[0].quantity, 3)
  assert.equal(state.tickets[0].started, Date.parse(task.cookingAt))
  assert.equal(state.tickets[0].finished, undefined)
  assert.match(state.tickets[0].note, /No salt\n2 .*Extra vegetables/)
  assert.equal(state.dishes[0].name, 'Soup')
  assert.equal(state.tickets[0].order, 'ORD-1')
})

test('uses Kitchen order references and preserves served/cancelled records', () => {
  const state = mapKdsState({
    ...input,
    tasks: [
      task,
      { ...task, kitchenTaskId: 'task-2', status: 'Served' },
      { ...task, status: 'Cancelled' },
    ],
  })
  assert.equal(state.tickets.length, 3)
  assert.ok(state.tickets.every((t) => t.order === 'ORD-1'))
  assert.equal(state.tickets[1].status, 'Served')
})

test('mixed orders keep held dishes in their own lane without losing active lines', () => {
  const state = mapKdsState({
    ...input,
    tasks: ['Pending', 'Cooking', 'Ready', 'Hold', 'Served'].map(
      (status, index) => ({ ...task, kitchenTaskId: `task-${index}`, status }),
    ),
  })
  assert.equal(state.tickets.filter((t) => t.status === 'Hold').length, 1)
  const groups = groupKdsOrders(state.tickets)
  assert.deepEqual(
    groups.map((g) => g.status),
    ['Pending', 'Cooking', 'Ready', 'Hold'],
  )
  assert.ok(groups.every((g) => g.id === 'ORD-1' && g.lines.length === 1))
  assert.equal(groups.flatMap((g) => g.lines).length, 4)
})

test('dish mapping preserves image URLs and provides a neutral fallback', () => {
  const state = mapKdsState({
    ...input,
    items: [
      {
        itemId: 'dish-1',
        itemName: 'Soup',
        imageUrl: 'https://cdn.example/soup.png',
      },
    ],
  })
  assert.equal(state.dishes[0].image, 'https://cdn.example/soup.png')
  assert.equal(
    mapKdsState(input).dishes[0].image,
    '/images/menu-placeholder.svg',
  )
})
