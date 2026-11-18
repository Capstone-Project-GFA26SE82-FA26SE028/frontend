import { Link, Navigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { BrandLogo } from '../../../components/BrandLogo/BrandLogo'
import { Icon } from '../../../components/Icon/Icon'
import { RegisterForm } from '../components/RegisterForm'
import { BrandBackground } from '../../../components/BrandBackground/BrandBackground'

export function RegisterPage() {
  const session = useAppSelector((state) => state.auth.session)
  if (session) return <Navigate to="/login" replace />
  return (
    <main
      lang="vi"
      className="relative isolate flex min-h-dvh flex-col items-center justify-center bg-[#123d30] px-4 pt-24 pb-8 text-[#173e32] sm:pb-12"
    >
      <BrandBackground />
      <Link
        to="/"
        className="absolute top-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white sm:top-6 sm:left-6"
      >
        <Icon name="arrow" size={16} className="rotate-180" />
        Trang chủ
      </Link>
      <Link
        to="/"
        aria-label="DineLink - Trang chủ"
        className="mb-7 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <BrandLogo />
      </Link>
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/15">
        <section className="px-6 py-8 sm:px-9 sm:py-10">
          <h1 className="text-center text-2xl font-bold tracking-tight">
            Tạo tài khoản DineLink
          </h1>
          <RegisterForm />
        </section>
      </div>
    </main>
  )
}
