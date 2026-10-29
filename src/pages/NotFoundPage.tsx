import { Link, useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  function goBack() {
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/', { replace: true })
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#faf9f6] px-6 py-12">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="text-2xl font-bold text-emerald-900">
          FoodHub<span className="text-emerald-500">.</span>
        </Link>
        <p className="mt-10 text-8xl font-bold tracking-tight text-emerald-700">
          404
        </p>
        <h1 className="mt-5 text-2xl font-bold text-slate-800">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Đường dẫn không tồn tại hoặc trang đã được di chuyển.
        </p>
        <button
          type="button"
          onClick={goBack}
          className="mt-8 rounded-xl bg-emerald-700 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
        >
          Quay về
        </button>
      </div>
    </main>
  )
}
