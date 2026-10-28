import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { runKitchen } from '../../shared/hooks'
export function KitchenLoginPage() {
  const [message, setMessage] = useState('')
  const [area, setArea] = useState('Hot kitchen')
  return (
    <div className="grid min-h-dvh place-items-center bg-[#f2f8fa] p-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3 text-emerald-800">
          <Icon name="leaf" size={36} />
          <span className="text-2xl font-bold">FoodHub / Kitchen</span>
        </div>
        <h1 className="text-3xl font-bold">Ready for your kitchen shift</h1>
        <p className="my-4 text-sm leading-6 text-slate-500">
          Track orders, coordinate cooking and serve every dish with care.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setMessage('Use the main sign-in page to authenticate.')
          }}
          className="space-y-4"
        >
          <label className="block text-sm">
            Email / Phone / Username
            <input
              required
              className="mgr-input mt-2"
              autoComplete="username"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              required
              type="password"
              className="mgr-input mt-2"
              autoComplete="current-password"
            />
          </label>
          <button className="mgr-button w-full">Sign in</button>
        </form>
        {message && (
          <p role="alert" className="mt-3 text-sm text-amber-700">
            {message}
          </p>
        )}
        <div className="my-5 border-t border-slate-100" />
        <label className="block text-sm">
          Demo kitchen station
          <select
            aria-label="Demo kitchen station"
            className="mgr-input my-2"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option>Hot kitchen</option>
            <option>Bar</option>
          </select>
        </label>
        <button
          onClick={() => runKitchen({ type: 'login', area })}
          className="mgr-secondary w-full"
        >
          Enter Kitchen demo
        </button>
        <p className="mt-5 text-xs leading-5 text-slate-400">
          Sample browser-session data. Inventory and service systems are not
          connected.
        </p>
      </div>
    </div>
  )
}
