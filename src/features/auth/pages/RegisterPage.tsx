import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { LoginBrandPanel } from '../components/LoginBrandPanel'
import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  const session = useAppSelector((state) => state.auth.session)
  if (session) return <Navigate to="/login" replace />
  return (
    <main
      lang="vi"
      className="flex min-h-dvh items-center justify-center bg-[#faf9f6] p-4 sm:p-8"
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-emerald-950/5 md:grid-cols-2">
        <LoginBrandPanel />
        <section className="p-6 sm:p-10">
          <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
          <p className="mt-2 text-sm text-muted">
            Dành cho khách hàng FoodHub.
          </p>
          <RegisterForm />
        </section>
      </div>
    </main>
  )
}
